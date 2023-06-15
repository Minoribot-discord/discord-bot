import { startBot } from "deps";
import { customBot } from "internals/client.ts";
import { loadCommands } from "internals/loadCommands.ts";
import { loadInhibitors } from "internals/loadInhibitors.ts";
import { loadModules } from "internals/loadModules.ts";

async function start() {
  if (customBot.config.devMode) {
    customBot.logger.warning(
      "Dev mode enabled! Procede with caution, and except some changes in behaviour.",
    );
  }

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
