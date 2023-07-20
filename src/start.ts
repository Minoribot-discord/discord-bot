import { CustomBot } from "internals/CustomBot.ts";
import {
  initializeModules,
  initializeTasks,
  loadFolders,
} from "internals/loadStuff.ts";
import { handleConsoleInput } from "internals/cli.ts";
import { initDatabase } from "database";

export async function start(bot: CustomBot) {
  const databaseWrapper = initDatabase(bot);

  await loadFolders(
    bot,
    [
      { name: "inhibitors" },
      { name: "locales" },
      { name: "commands" },
      { name: "tasks", afterFunc: initializeTasks },
      { name: "modules", afterFunc: initializeModules },
    ],
  );

  bot.db = await databaseWrapper;

  // start the bot
  bot.logger.info("Starting connection to the Discord API & gateway");
  await bot.start();

  await handleConsoleInput(bot);
}
