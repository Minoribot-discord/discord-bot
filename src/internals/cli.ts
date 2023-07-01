import { flags } from "deps";
import { botConfig } from "internals/config.ts";
import { CustomBot } from "internals/CustomBot.ts";
type args = flags.Args & {
  refreshcommands?: string;
  r?: string;
  dev?: string;
  d?: string;
};

function convertCommandLineArgumentToBoolean(cliArg: string): boolean | never {
  if (cliArg === "false") return false;
  else if (cliArg === "true") return true;

  throw new Error(`The argument ${cliArg} needs to be a boolean`);
}
const convStr = convertCommandLineArgumentToBoolean;

function readStartupCommandLineArgs() {
  const parsedArgs = flags.parse<args>(Deno.args);

  if ("refreshcommands" in parsedArgs || "r" in parsedArgs) {
    botConfig.refreshCommands = convStr(parsedArgs.refreshcommands!) ??
      convStr(parsedArgs.r!) ??
      false;
  }
  if ("dev" in parsedArgs || "d" in parsedArgs) {
    botConfig.devMode = convStr(parsedArgs.dev!) ??
      convStr(parsedArgs.d!) ??
      false;
  }
}

async function handleConsoleInput(_bot: CustomBot) {
  const decoder = new TextDecoder();
  for await (const chunk of Deno.stdin.readable) {
    const text = decoder.decode(chunk);
    console.log(text);
  }
}

export { handleConsoleInput, readStartupCommandLineArgs };
