import { flags } from "deps";
import { botConfig } from "internals/config.ts";
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

  // I wanna take input from the terminal, kind of like a console, with commands

  // How can I request input from the console in Deno?
}

export { readStartupCommandLineArgs };
