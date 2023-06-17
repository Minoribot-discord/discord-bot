import { Command, CommandExecuteFunc, CommandScope } from "structures";
import { Embed } from "deps";

export default class InfoCommand extends Command {
  constructor() {
    super({
      name: "info",
      description: "Mostra informacions sobre el bot.",
      scope: CommandScope.SUPPORT,
      defaultMemberPermissions: ["ADMINISTRATOR"],
      dmPermission: true,
      execute,
    });
  }
}

const infoEmbed: Embed = { title: "Informacions " };

const execute: CommandExecuteFunc = async (context) => {
  await context.reply({ embeds: [infoEmbed] });
};
