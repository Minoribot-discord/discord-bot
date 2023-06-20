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

const execute: CommandExecuteFunc = async (context) => {
  const infoEmbed: Embed = {
    title: context.i18n.translate("COMMAND.APP.INFO.INFOEMBED.TITLE"),
    
  };
  await context.reply({ embeds: [infoEmbed] });
};
