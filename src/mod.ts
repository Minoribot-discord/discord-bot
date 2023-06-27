import { botConfig } from "config";
import { logger } from "internals/logger.ts";
import { readStartupCommandLineArgs } from "internals/cli.ts";

// read the args passed to the script at startup and handle them
readStartupCommandLineArgs();

if (botConfig.devMode) {
  logger.warning(
    "Dev mode enabled! Procede with caution, and except some changes in behaviour.",
  );
}

// i really want this to be imported AFTER the previous lines
await (await import(`./start.ts`)).start();
