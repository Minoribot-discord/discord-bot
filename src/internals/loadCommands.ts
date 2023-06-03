import { fs } from "deps";
import { CustomBot } from "./client.ts";
import { Command } from "./classes/Command.ts";
import { CommandCategory } from "./classes/CommandCategory.ts";

const pathToCommandDirectory = "commands";

async function loadCommands(bot: CustomBot) {
  bot.logger.info("Started loading commands");

  await importCategories(bot);

  for (const category of bot.loadedCmdCategories.array()) {
    const pathToCategory = `${pathToCommandDirectory}/${category.name}`;
    await importCommands(pathToCategory, bot);
  }
}

export { loadCommands };

async function importCategories(bot: CustomBot) {
  for await (
    const categoryEntry of Deno.readDir(`./src/${pathToCommandDirectory}`)
  ) {
    console.log(categoryEntry.name);
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
  pathToCategory: string,
  bot: CustomBot,
) {
  for await (const entry of Deno.readDir(`./src/${pathToCategory}`)) {
    console.log(entry.name);

    if (entry.isFile && (entry.name !== "mod.ts")) {
      const { default: command_ } = await import(
        `../${pathToCategory}/${entry.name}`
      );

      const command: Command = new command_(bot);
    }
  }
}
