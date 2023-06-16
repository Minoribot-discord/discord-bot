import { startBot } from "deps";
import {
  customBot,
  loadCommands,
  loadInhibitors,
  loadModules,
} from "internals";

async function start() {
  if (customBot.config.devMode) {
    customBot.logger.warning(
      "Dev mode enabled! Procede with caution, and except some changes in behaviour.",
    );
  }

  customBot.database.init();

  // load all the inhibitors
  // they're basically filters/conditions for commands
  await loadInhibitors(customBot);

  // load all the commands
  await loadCommands(customBot);

  // load all the events etc...
  await loadModules(customBot);

  // start the bot
  customBot.logger.info("Starting connection to the Discord API & gateway");
  return startBot(customBot);
}

export { start };
