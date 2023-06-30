import { startBot } from "deps";
import { customBot } from "bot";
import {
  initializeModules,
  initializeTasks,
  loadFolders,
} from "internals/loadStuff.ts";
import { initDatabase } from "database";

async function start() {
  customBot.db = await initDatabase(customBot);

  await loadFolders(
    customBot,
    [
      { name: "inhibitors" },
      {
        name: "locales",
        afterFunc: customBot.i18n.init.bind(customBot.i18n),
      },
      { name: "commands" },
      { name: "tasks", afterFunc: initializeTasks },
      { name: "modules", afterFunc: initializeModules },
    ],
  );

  // start the bot
  customBot.logger.info("Starting connection to the Discord API & gateway");
  return startBot(customBot);
}

export { start };
