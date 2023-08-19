import { flags } from "deps";
import { botConfig } from "config";
import { CustomBot } from "internals/CustomBot.ts";

type args = flags.Args & {
  refreshcommands?: string | boolean;
  r?: string | boolean;
  dev?: string | boolean;
  d?: string | boolean;
};

function convertCommandLineArgumentToBoolean(
  cliArg: string | boolean,
): boolean | null {
  if (cliArg === "false") return false;
  else if (cliArg === "true") return true;

  if (typeof cliArg === "string") {
    return null;
  }
  return cliArg;
}
const convStr = convertCommandLineArgumentToBoolean;

export function readStartupCommandLineArgs() {
  const parsedArgs = flags.parse<args>(Deno.args);

  if ("refreshcommands" in parsedArgs || "r" in parsedArgs) {
    botConfig.refreshCommands = convStr(
      parsedArgs.refreshcommands ?? parsedArgs.r ?? false,
    ) ?? false;
  }
  if ("dev" in parsedArgs || "d" in parsedArgs) {
    botConfig.devMode = convStr(
      parsedArgs.dev ??
        parsedArgs.d ??
        false,
    ) ?? false;
  }
}

export async function handleConsoleInput(_bot: CustomBot) {
  const decoder = new TextDecoder();
  for await (const chunk of Deno.stdin.readable) {
    const text = decoder.decode(chunk);
    console.log(text);
  }
}
