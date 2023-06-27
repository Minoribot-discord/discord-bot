import { startBot } from "deps";
import { customBot } from "bot";
import { initializeModules, loadFolders } from "internals/loadStuff.ts";
import { mongoClient } from "database";

async function start() {
  // forces the database to load and initialize
  mongoClient;

  await loadFolders(
    customBot,
    [
      { name: "inhibitors" },
      {
        name: "locales",
        afterFunc: customBot.i18n.init,
      },
      { name: "commands" },
      { name: "modules", afterFunc: initializeModules },
    ],
  );

  // start the bot
  customBot.logger.info("Starting connection to the Discord API & gateway");
  return startBot(customBot);
}

export { start };
