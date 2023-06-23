import { flags } from "deps";
import { customBot } from "internals";
type args = flags.Args & {
  refreshcommands?: boolean;
  r?: boolean;
  dev?: boolean;
  d?: boolean;
};

function readStartupCommandLineArgs() {
  const parsedArgs = flags.parse<args>(Deno.args);

  if (parsedArgs.refreshcommands || parsedArgs.r) {
    customBot.config.refreshCommands = parsedArgs.refreshcommands ||
      parsedArgs.r ||
      false;
  }
  if (parsedArgs.dev || parsedArgs.d) {
    customBot.config.devMode = parsedArgs.dev ||
      parsedArgs.d ||
      false;
  }
}

export { readStartupCommandLineArgs };
