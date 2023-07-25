import { CommandExecuteFunc, CommandScope } from "structures";
import { createCommand } from "internals/loadStuff.ts";
import { makeBaseEmbed } from "utils";
import { customCache } from "cache/createCache.ts";

const execute: CommandExecuteFunc = async (
  ctx,
  i18n,
) => {
  const systemMemoryInfo = Deno.systemMemoryInfo();

  const infoEmbed = makeBaseEmbed()
    .setTitle(
      i18n.translate("COMMAND.APP.INFO.EMBED.TITLE"),
    )
    .addFields([{
      name: "Elements in cache",
      value: `**Users:** ${await customCache.users.size()}\n` +
        `**Members:** ${await customCache.members.size()}\n` +
        `**Channels:** ${await customCache.channels.size()}\n` +
        `**Guilds:** ${await customCache.guilds.size()}\n` +
        `**Messages:** ${await customCache.messages.size()}\n`,
    }, {
      name: "Resource consumption",
      value: `**Ram:** ${
        (Deno.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
      }/${(systemMemoryInfo.total / 1024).toFixed(0)} MB`,
    }]);
  await ctx.reply(infoEmbed);
};

createCommand({
  name: "botinfo",
  category: "bot",
  description: "Show some info about the bot",
  scope: CommandScope.GLOBAL,
  dmPermission: true,
  execute,
});
