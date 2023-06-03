import { startBot } from "deps";
import { customBot } from "./internals/client.ts";
import { loadModules } from "./internals/loadModules.ts";
import { loadCommands } from "./internals/loadCommands.ts";

// load all the commands
await loadCommands(customBot);

// load all the events etc...
await loadModules(customBot);

// start the bot
customBot.logger.info("Starting bot");
await startBot(customBot);
