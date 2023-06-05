import { startBot } from "deps";
import { customBot } from "./internals/client.ts";
import { loadModules } from "./internals/loadModules.ts";
import { loadCommands } from "./internals/loadCommands.ts";
import { readStartupCommandLineArgs } from "./internals/cli.ts";

// read the args passed to the script at startup and handle them
readStartupCommandLineArgs(customBot);

// load all the commands
await loadCommands(customBot);

// load all the events etc...
await loadModules(customBot);

// start the bot
customBot.logger.info("Starting bot");
await startBot(customBot);
