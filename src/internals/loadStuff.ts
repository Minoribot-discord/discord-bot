import { Collection, fs } from "deps";
import { CustomBot } from "internals/CustomBot.ts";
import { logger } from "internals/logger.ts";
import {
  BaseCommand,
  Command,
  CommandCategory,
  CommandCategoryParams,
  CommandParams,
  CommandScope,
  Inhibitor,
  InhibitorParams,
  Locale,
  Module,
  ModuleParams,
  RunningTasks,
  SubCommand,
  SubCommandGroup,
  SubCommandGroupParams,
  SubCommandParams,
  Task,
} from "structures";

const tasks = new Collection<string, Task>();
const runningTasks: RunningTasks = { initialTimeouts: [], intervals: [] };
const inhibitors = new Collection<string, Inhibitor>();
const locales = new Collection<string, Locale>();
const modules = new Collection<string, Module>();
const commandCategories = new Collection<string, CommandCategory>();
const commands = new Collection<string, Command>();
const subCommands = new Collection<string, (SubCommandGroup | SubCommand)>();

const pluginFolder = "plugins";

type AfterFunc =
  | (() => void | Promise<void>)
  | ((bot: CustomBot) => void | Promise<void>);

async function loadFolders(
  bot: CustomBot,
  subFolders: Array<{ name: string; afterFunc?: AfterFunc }>,
) {
  for (const subFolder of subFolders) {
    bot.logger.info(`Loading folder ${pluginFolder}/${subFolder.name}`);
    fs.ensureDirSync(`./src/${pluginFolder}/${subFolder.name}`);

    for await (
      const walkEntry of fs.walk(`./src/${pluginFolder}/${subFolder.name}`)
    ) {
      if (walkEntry.isFile) {
        await import(`../../${walkEntry.path}`);
      }
    }

    await subFolder.afterFunc?.(bot);
  }
}

function loadTask(task: Task): Task {
  tasks.set(task.name, task);

  return task;
}

// Code ripped of from "https://github.com/AmethystFramework/framework/blob/4bd01b466d4e3435adf26c57d887a7c7416f3e42/src/utils/extra.ts"
function initializeTasks(bot: CustomBot) {
  for (const task of tasks.values()) {
    runningTasks.initialTimeouts.push(
      setTimeout(async () => {
        await task.execute(bot);
        runningTasks.intervals.push(
          setInterval(async () => {
            if (!bot.ready) return;
            try {
              await task.execute(bot);
            } catch (error) {
              throw error;
            }
          }, task.interval),
        );
      }, task.interval - (Date.now() % task.interval)),
    );
  }
}

function createInhibitor(params: InhibitorParams): Inhibitor {
  const inhibitor = new Inhibitor(params);
  inhibitors.set(inhibitor.name, inhibitor);

  return inhibitor;
}

function loadLocale(locale: Locale): Locale {
  locales.set(locale.code, locale);

  return locale;
}

function createModule(params: ModuleParams): Module {
  const name = params.name;
  if (modules.has(name)) {
    throw new Error(`Module name ${name} cannot be created twice`);
  }

  const module = new Module(params);
  modules.set(module.name, module);

  return module;
}

async function initializeModules(bot: CustomBot) {
  const modulesArray = Array.from(modules.values());
  const sortedModules = modulesArray.sort((a, b) => a.priority - b.priority);

  for (const module of sortedModules) {
    await module.init(bot);
    bot.logger.info(`Module ${module.name} initialized`);
  }
}

function createCommandCategory(
  params: CommandCategoryParams,
  mutable = false,
): CommandCategory {
  const name = params.name;
  if (commandCategories.has(name) && !(commandCategories.get(name)!.mutable)) {
    throw new Error(
      `Category named ${name} is not mutable and therefore cannot be recreated via this function`,
    );
  }

  const category = new CommandCategory(params);
  category.mutable = mutable;
  commandCategories.set(category.name, category);

  return category;
}

function checkAndAddInhibitorsToCommand(baseCommand: BaseCommand) {
  if (baseCommand._inhibitors.length === 0) return;

  const nonExistentInhibitors: string[] = [];

  for (const inhibitorName of baseCommand._inhibitors) {
    if (!inhibitors.has(inhibitorName)) {
      nonExistentInhibitors.push(inhibitorName);
    } else {
      baseCommand.inhibitors.push(inhibitors.get(inhibitorName)!);
    }
  }

  if (nonExistentInhibitors.length > 0) {
    const errorString =
      `Cannot continue, incorrect or missing inhibitors detected for the command/subcommand/subcommand group ${baseCommand.name}`;
    logger.error(
      `${errorString}:\n${nonExistentInhibitors.join(" - ")}`,
    );
    throw new Error(errorString);
  }
}

function createCommand(params: CommandParams): Command {
  const name = params.name;
  if (commands.has(name)) {
    throw new Error(`Command named ${name} cannot be created twice.`);
  }
  if (
    (params.scope === CommandScope.GUILD) &&
    (params.guildIds?.length === 0)
  ) {
    throw new Error(
      `Guild scoped command "${name}" needs to have at least one guild id`,
    );
  }

  const command = new Command(params);
  checkAndAddInhibitorsToCommand(command);
  commands.set(command.name, command);

  let category = commandCategories.get(command.category);
  if (!category) {
    category = createCommandCategory({ name: command.category }, true);
  }
  category.commands.push(command);

  return command;
}

function createSubCommandGroup(
  parentName: string,
  params: SubCommandGroupParams,
): SubCommandGroup {
  const name = params.name;
  const key = `${parentName}/${name}`;
  if (subCommands.has(key)) {
    throw new Error(`Subcommand group named ${name} cannot be created twice.`);
  }

  const parent = commands.get(parentName);
  if (!parent) {
    throw new Error(
      `Parent (command) named ${parentName} does not exist, create it first.`,
    );
  }

  const subCommandGroup = new SubCommandGroup(params);
  subCommandGroup.parent = parent;

  checkAndAddInhibitorsToCommand(subCommandGroup);

  parent.subCommands.push(subCommandGroup);
  parent.options.push(subCommandGroup.discordOption);

  subCommands.set(key, subCommandGroup);

  return subCommandGroup;
}

/**
 * if parent is a sub command group, the parent parameter should use this format: `commandName/subCommandGroupName`
 */
function createSubCommand(
  parentName: string,
  params: SubCommandParams,
): SubCommand {
  const name = params.name;
  const key = `${parentName}/${name}`;
  if (subCommands.has(key)) {
    throw new Error(`Subcommand named ${name} cannot be created twice.`);
  }

  const parent: Command | SubCommand | SubCommandGroup | undefined =
    commands.get(parentName) ||
    subCommands.get(parentName);
  if (!(parent instanceof SubCommandGroup || parent instanceof Command)) {
    throw new Error(
      `The parent of a subcommand has to be a command or a subcommand group`,
    );
  }
  if (!parent) {
    throw new Error(
      `Parent (command or subcommand group) named ${parentName} does not exist, create it first.`,
    );
  }

  const subCommand = new SubCommand(params);
  subCommand.parent = parent;

  checkAndAddInhibitorsToCommand(subCommand);

  parent.subCommands.push(subCommand);
  parent.options.push(subCommand.discordOption);

  subCommands.set(key, subCommand);

  return subCommand;
}

export {
  commandCategories,
  commands,
  createCommand,
  createCommandCategory,
  createInhibitor,
  createModule,
  createSubCommand,
  createSubCommandGroup,
  inhibitors,
  initializeModules,
  initializeTasks,
  loadFolders,
  loadLocale,
  loadTask,
  locales,
  modules,
  runningTasks,
  subCommands,
  tasks,
};
