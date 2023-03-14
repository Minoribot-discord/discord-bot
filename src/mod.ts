import { customBot } from "./internals/client.ts";
import { startBot } from "deps";
import { loadModules } from "./internals/loadModules.ts";

// load all the events etc...
await loadModules(customBot);

// start the bot
await startBot(customBot);
