import { flags } from "deps";
import { CustomBot } from "./client.ts";
type args = flags.Args & { refreshcommands?: boolean };

function readStartupCommandLineArgs(bot: CustomBot) {
  const parsedArgs = flags.parse<args>(Deno.args);
  if (parsedArgs.refreshcommands) {
    console.log(parsedArgs);
    bot.config.refreshCommands = parsedArgs.refreshcommands;
  }
}

export { readStartupCommandLineArgs };
