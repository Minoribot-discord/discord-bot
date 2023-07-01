import { startBot } from "deps";
import { CustomBot } from "internals/CustomBot.ts";
import {
  initializeModules,
  initializeTasks,
  loadFolders,
} from "internals/loadStuff.ts";
import { initDatabase } from "database";

async function start(bot: CustomBot) {
  bot.db = await initDatabase(bot);

  await loadFolders(
    bot,
    [
      { name: "inhibitors" },
      {
        name: "locales",
        afterFunc: bot.i18n.init.bind(bot.i18n),
      },
      { name: "commands" },
      { name: "tasks", afterFunc: initializeTasks },
      { name: "modules", afterFunc: initializeModules },
    ],
  );

  // start the bot
  bot.logger.info("Starting connection to the Discord API & gateway");
  await startBot(bot);
}

export { start };
