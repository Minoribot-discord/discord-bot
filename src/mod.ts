import { botConfig } from "config";
import { readStartupCommandLineArgs } from "internals/cli.ts";
import { customBot } from "bot";
botConfig;
customBot;
// read the args passed to the script at startup and handle them
readStartupCommandLineArgs();

if (customBot.config.devMode) {
  customBot.logger.warning(
    "Dev mode enabled! Procede with caution, and except some changes in behaviour.",
  );
}

// i really want this import to be executed AFTER the previous stuff
const str = "start";
await (await import(`./${str}.ts`)).start();
