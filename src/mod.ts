import { startBot } from "deps";
import { customBot } from "./internals/client.ts";
import { loadModules } from "./internals/loadModules.ts";
import { loadCommands } from "./internals/loadCommands.ts";
import { readStartupCommandLineArgs } from "./internals/cli.ts";
import { loadInhibitors } from "./internals/loadInhibitors.ts";

// read the args passed to the script at startup and handle them
readStartupCommandLineArgs(customBot);

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
await startBot(customBot);
