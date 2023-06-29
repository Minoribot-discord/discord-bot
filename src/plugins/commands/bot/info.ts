import { CommandExecuteFunc, CommandScope } from "structures";
import { Embed } from "deps";
import { createCommand } from "internals/loadStuff.ts";

const execute: CommandExecuteFunc = async (
  ctx,
  i18n,
) => {
  const infoEmbed: Embed = {
    title: i18n.translate("COMMAND.APP.INFO.EMBED.TITLE"),
    fields: [{
      name: "Caches",
      value: `**Users:** ${ctx.bot.users.size}\n` +
        `**Channels:** ${ctx.bot.channels.size}\n` +
        `**Guilds:** ${ctx.bot.guilds.size}\n`,
    }],
  };
  await ctx.reply({ embeds: [infoEmbed] });
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
