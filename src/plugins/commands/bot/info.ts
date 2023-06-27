import { CommandExecuteFunc, CommandScope } from "structures";
import { Embed } from "deps";
import { createCommand } from "internals/loadStuff.ts";

const execute: CommandExecuteFunc = async (
  context,
  i18n,
) => {
  const infoEmbed: Embed = {
    title: i18n.translate("COMMAND.APP.INFO.INFOEMBED.TITLE"),
  };
  await context.reply({ embeds: [infoEmbed] });
};

createCommand({
  name: "info",
  category: "bot",
  description: "Show some info about the bot",
  scope: CommandScope.GLOBAL,
  defaultMemberPermissions: ["ADMINISTRATOR"],
  dmPermission: true,
  execute,
});
