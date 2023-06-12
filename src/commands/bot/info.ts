import { Command, CommandExecuteFunc, CommandScope } from "classes";

export default class InfoCommand extends Command {
  constructor() {
    super({
      name: "info",
      description: "Mostra informacions sobre el bot.",
      scope: CommandScope.SUPPORT,
      inhibitorStrings: ["isAuthorAdmin"],
      execute,
    });
  }
}

const execute: CommandExecuteFunc = async (context) => {
  await context.reply("Informacions sobre el bot blablabla", true);

  await context.reply("test followup response");
};
