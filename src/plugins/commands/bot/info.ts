import { Command, CommandExecuteFunc, CommandScope } from "structures";
import { Embed } from "deps";

const execute: CommandExecuteFunc = async (context) => {
  const infoEmbed: Embed = {
    title: context.i18n.translate("COMMAND.APP.INFO.INFOEMBED.TITLE"),
  };
  await context.reply({ embeds: [infoEmbed] });
};

export default new Command({
  name: "info",
  description: "Show some info about the bot",
  scope: CommandScope.SUPPORT,
  defaultMemberPermissions: ["ADMINISTRATOR"],
  dmPermission: true,
  execute,
});
