import { snakelize } from "deps";
import { botConfig } from "config";
import { customBot } from "bot";
import { readStartupCommandLineArgs } from "internals/cli.ts";
import { start } from "./start.ts";

// read the args passed to the script at startup and handle them
readStartupCommandLineArgs();

if (botConfig.devMode) {
  customBot.logger.warn(
    "Dev mode enabled! Procede with caution, and except some changes in behaviour.",
  );
}

const baseFetch = globalThis.fetch;
globalThis.fetch = (url, data) => {
  const sUrl = url.toString();
  if (
    sUrl.includes("api/v10/webhooks/") || sUrl.includes("api/v10/interactions")
  ) {
    if (data?.body && data.body instanceof FormData) {
      const jsonRaw = data.body.get("payload_json")?.toString();
      if (jsonRaw) {
        data.body.set(
          "payload_json",
          JSON.stringify(snakelize(JSON.parse(jsonRaw))),
        );
      }
    }
  }

  return baseFetch(url, data);
};

// Little script to convert the enum BitwisePermissionFlags to a object, filtering any non-string key

// let object: any = {};

// console.log(
//   Object.keys(BitwisePermissionFlags).filter((key) => isNaN(parseInt(key))).map(
//     (key) => object[`PERMISSION.${key}`] = undefined,
//   ),
// );
// console.log(object);

await start(customBot);
