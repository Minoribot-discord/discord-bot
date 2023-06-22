import {
  BaseCommand,
  Command,
  CommandCategory,
  CommandScope,
  SubCommand,
  SubCommandGroup,
} from "structures";
import { Collection } from "deps";
import { CustomBot } from "internals";

const pathToCommandDirectory = "plugins/commands";

async function loadCommands(bot: CustomBot) {
  bot.logger.info("Started loading commands");

  bot.commands.clear();
  bot.subCommands.clear();
  bot.cmdCategories.clear();

  await importCategories(bot);

  for (const category of bot.cmdCategories.array()) {
    const pathToCategory = `${pathToCommandDirectory}/${category.name}`;
    await importCommands(bot, pathToCategory, category);
  }

  for (const command of bot.commands.array()) {
    await recursiveLoadSubCommands(bot, command);
  }

  const incorrectInhibitorsPerCommand = checkNonExistentInhibitors(
    bot,
    new Collection<string, BaseCommand>([
      ...bot.subCommands.entries(),
      ...bot.commands.entries(),
    ]),
  );

  if (incorrectInhibitorsPerCommand.size > 0) {
    let string_ = "Incorrect of missing inhibitors detected:\n";

    for (
      const [command, incorrectInhibitors] of incorrectInhibitorsPerCommand
    ) {
      string_ = string_ + "\n";
      string_ = string_ + `${command} : ${incorrectInhibitors.join(" - ")}`;
    }

    bot.logger.error(string_);
    throw new Error(
      "Cannot continue, incorrect or missing inhibitors detected",
    );
  }
}

async function importCategories(bot: CustomBot) {
  for await (
    const categoryEntry of Deno.readDir(`./src/${pathToCommandDirectory}`)
  ) {
    if (categoryEntry.isDirectory) {
      const pathToCategory = `${pathToCommandDirectory}/${categoryEntry.name}`;
      const { default: category_ } = await import(
        `${pathToCategory}/mod.ts`
      );

      const category: CommandCategory = category_;

      bot.cmdCategories.set(category.name, category);
    }
  }
}

async function importCommands(
  bot: CustomBot,
  pathToCategory: string,
  category: CommandCategory,
) {
  for await (const entry of Deno.readDir(`./src/${pathToCategory}`)) {
    if (entry.isFile && (entry.name !== "mod.ts")) {
      const { default: command } = await import(
        `${pathToCategory}/${entry.name}`
      );
      if (
        !command || typeof command !== "object" ||
        !(command instanceof Command)
      ) continue;

      command.filePath = `${
        pathToCategory.replace(`${pathToCommandDirectory}/`, "")
      }/${entry.name}`;

      if (bot.commands.has(command.name)) {
        throw new Error(
          `two commands with the same name (${command.name}): ` +
            `${command.filePath} | ${bot
              .commands.get(command.name)?.filePath}`,
        );
      }
      if (
        (command.scope === CommandScope.GUILD) &&
        (command.guildIds.length === 0)
      ) {
        throw new Error(
          `Guild scoped command "${command.name}" needs to have at least one guild id`,
        );
      }

      category.commands.push(command);

      bot.commands.set(command.name, command);
    }
  }
}

async function recursiveLoadSubCommands(
  bot: CustomBot,
  command: Command | SubCommandGroup,
) {
  for (const subCommand of command.subCommands) {
    if (subCommand instanceof SubCommandGroup) {
      bot.subCommands.set(
        `${subCommand.parent.name}/${subCommand.name}`,
        subCommand,
      );
      await recursiveLoadSubCommands(bot, subCommand);
    } else if (subCommand instanceof SubCommand) {
      let key = "";

      if (subCommand.parent instanceof SubCommandGroup) {
        key =
          `${subCommand.parent.parent.name}/${subCommand.parent.name}/${subCommand.name}`;
      } else {
        key = `${subCommand.parent.name}/${subCommand.parent}`;
      }

      bot.subCommands.set(key, subCommand);
    }
  }
}

function checkNonExistentInhibitors(
  bot: CustomBot,
  baseCommands: Collection<string, BaseCommand>,
) {
  const nonExistentInhibitors = new Collection<string, string[]>();

  for (const [commandName, command] of baseCommands.entries()) {
    if (command.inhibitors.length === 0) continue;

    const commandNonExistentInhibitors: string[] = [];

    for (const inhibitorName of command.inhibitors) {
      if (!bot.inhibitors.has(inhibitorName)) {
        commandNonExistentInhibitors.push(inhibitorName);
      } else {
        command._inhibitors.push(bot.inhibitors.get(inhibitorName)!);
      }
    }

    if (commandNonExistentInhibitors.length > 0) {
      nonExistentInhibitors.set(commandName, commandNonExistentInhibitors);
    }
  }

  return nonExistentInhibitors;
}

export { loadCommands };
