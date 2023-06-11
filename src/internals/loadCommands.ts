import { CustomBot } from "./client.ts";
import {
  Command,
  CommandCategory,
  SubCommand,
  SubCommandGroup,
} from "./classes/classes.ts";

const pathToCommandDirectory = "commands";

async function loadCommands(bot: CustomBot) {
  bot.logger.info("Started loading commands");

  await importCategories(bot);

  for (const category of bot.loadedCmdCategories.array()) {
    const pathToCategory = `${pathToCommandDirectory}/${category.name}`;
    await importCommands(bot, pathToCategory, category);
  }
}

async function importCategories(bot: CustomBot) {
  for await (
    const categoryEntry of Deno.readDir(`./src/${pathToCommandDirectory}`)
  ) {
    if (categoryEntry.isDirectory || categoryEntry.isSymlink) {
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

      await recursiveLoadSubCommands(bot, command);
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

export { loadCommands };
