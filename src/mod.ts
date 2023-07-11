import { botConfig } from "config";
import { customBot } from "bot";
import { readStartupCommandLineArgs } from "internals/cli.ts";
import { start } from "./start.ts";

// read the args passed to the script at startup and handle them
readStartupCommandLineArgs();

if (botConfig.devMode) {
  customBot.logger.warning(
    "Dev mode enabled! Procede with caution, and except some changes in behaviour.",
  );
}

// Little script to convert the enum BitwisePermissionFlags to a object, filtering any non-string key

// let object: any = {};

// console.log(
//   Object.keys(BitwisePermissionFlags).filter((key) => isNaN(parseInt(key))).map(
//     (key) => object[`PERMISSION.${key}`] = undefined,
//   ),
// );
// console.log(object);

await start(customBot);
