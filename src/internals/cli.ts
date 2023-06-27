import { flags } from "deps";
import { botConfig } from "internals/config.ts";
type args = flags.Args & {
  refreshcommands?: boolean;
  r?: boolean;
  dev?: boolean;
  d?: boolean;
};

function readStartupCommandLineArgs() {
  const parsedArgs = flags.parse<args>(Deno.args);

  if (parsedArgs.refreshcommands || parsedArgs.r) {
    botConfig.refreshCommands = parsedArgs.refreshcommands ||
      parsedArgs.r ||
      false;
  }
  if (parsedArgs.dev || parsedArgs.d) {
    botConfig.devMode = parsedArgs.dev ||
      parsedArgs.d ||
      false;
  }
}

export { readStartupCommandLineArgs };
