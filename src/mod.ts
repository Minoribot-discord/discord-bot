import { botConfig } from "config";
import { logger } from "internals/logger.ts";
import { readStartupCommandLineArgs } from "internals/cli.ts";
import { start } from "./start.ts";

// read the args passed to the script at startup and handle them
readStartupCommandLineArgs();

if (botConfig.devMode) {
  logger.warning(
    "Dev mode enabled! Procede with caution, and except some changes in behaviour.",
  );
}

await start();
