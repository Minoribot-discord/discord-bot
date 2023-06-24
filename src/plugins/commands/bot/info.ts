import { Command, CommandExecuteFunc, CommandScope } from "structures";
import { Embed } from "deps";

const execute: CommandExecuteFunc = async (
  context,
  i18n,
) => {
  const infoEmbed: Embed = {
    title: i18n.translate("COMMAND.APP.INFO.INFOEMBED.TITLE"),
  };
  await context.reply({ embeds: [infoEmbed] });
};

export default new Command({
  name: "info",
  description: "Show some info about the bot",
  scope: CommandScope.GLOBAL,
  defaultMemberPermissions: ["ADMINISTRATOR"],
  dmPermission: true,
  execute,
});
