import { CustomBot } from "./CustomBotType.ts";
import {
  BaseCommand,
  Command,
  CommandCategory,
  SubCommand,
  SubCommandGroup,
} from "./classes/classes.ts";
import { Collection } from "deps";

const pathToCommandDirectory = "commands";

async function loadCommands(bot: CustomBot) {
  bot.logger.info("Started loading commands");

  await importCategories(bot);

  for (const category of bot.loadedCmdCategories.array()) {
    const pathToCategory = `${pathToCommandDirectory}/${category.name}`;
    await importCommands(bot, pathToCategory, category);
  }

  for (const command of bot.loadedCommands.array()) {
    await recursiveLoadSubCommands(bot, command);
  }

  const incorrectInhibitorsPerCommand = checkNonExistentInhibitors(
    bot,
    new Collection<string, BaseCommand>([
      ...bot.loadedSubCommands.entries(),
      ...bot.loadedCommands.entries(),
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
        `../${pathToCategory}/mod.ts`
      );

      const category: CommandCategory = new category_(bot);

      bot.loadedCmdCategories.set(category.name, category);
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
      const { default: command_ } = await import(
        `../${pathToCategory}/${entry.name}`
      );

      const command: Command = new command_(bot);
      command.filePath = `${
        pathToCategory.replace(`${pathToCommandDirectory}/`, "")
      }/${entry.name}`;

      if (bot.loadedCommands.has(command.name)) {
        throw new Error(
          `two commands with the same name (${command.name}),` +
            `${command.filePath} | ${bot
              .loadedCommands.get(command.name)?.filePath}`,
        );
      }

      category.commands.push(command);

      bot.loadedCommands.set(command.name, command);
    }
  }
}

async function recursiveLoadSubCommands(
  bot: CustomBot,
  command: Command | SubCommandGroup,
) {
  for (const subCommand of command.subCommands) {
    if (subCommand instanceof SubCommandGroup) {
      bot.loadedSubCommands.set(
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

      bot.loadedSubCommands.set(key, subCommand);
    }
  }
}

function checkNonExistentInhibitors(
  bot: CustomBot,
  baseCommands: Collection<string, BaseCommand>,
) {
  const nonExistentInhibitors = new Collection<string, string[]>();

  for (const [commandName, command] of baseCommands.entries()) {
    if (command.inhibitorStrings.length === 0) continue;

    const commandNonExistentInhibitors: string[] = [];

    for (const inhibitorName of command.inhibitorStrings) {
      if (!bot.loadedInhibitors.has(inhibitorName)) {
        commandNonExistentInhibitors.push(inhibitorName);
      } else {
        command.inhibitors.push(bot.loadedInhibitors.get(inhibitorName)!);
      }
    }

    if (commandNonExistentInhibitors.length > 0) {
      nonExistentInhibitors.set(commandName, commandNonExistentInhibitors);
    }
  }

  return nonExistentInhibitors;
}

export { loadCommands };
