import { flags } from "deps";
import { CustomBot } from "./CustomBotType.ts";
type args = flags.Args & {
  refreshcommands?: boolean;
  r?: boolean;
  dev?: boolean;
  d?: boolean;
};

function readStartupCommandLineArgs(bot: CustomBot) {
  const parsedArgs = flags.parse<args>(Deno.args);

  if (parsedArgs.refreshcommands || parsedArgs.r) {
    bot.config.refreshCommands = parsedArgs.refreshcommands ||
      parsedArgs.r ||
      false;
  }
  if (parsedArgs.dev || parsedArgs.d) {
    bot.config.devMode = parsedArgs.dev ||
      parsedArgs.d ||
      false;
  }
}

export { readStartupCommandLineArgs };
