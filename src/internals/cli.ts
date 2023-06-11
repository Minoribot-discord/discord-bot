import { flags } from "deps";
import { CustomBot } from "./CustomBotType.ts";
type args = flags.Args & { refreshcommands?: boolean };

function readStartupCommandLineArgs(bot: CustomBot) {
  const parsedArgs = flags.parse<args>(Deno.args);
  if (parsedArgs.refreshcommands) {
    bot.config.refreshCommands = parsedArgs.refreshcommands;
  }
}

export { readStartupCommandLineArgs };
