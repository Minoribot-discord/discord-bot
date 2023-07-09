import { ApplicationCommandOption, ApplicationCommandOptionTypes } from "deps";
import { createCommand } from "internals/loadStuff.ts";
import { CommandScope } from "structures";
import { getOrFetchUser, makeBasePunishmentEmbed } from "utils";

const options: ApplicationCommandOption[] = [
  {
    name: "user",
    description: "The user or used id to unban",
    type: ApplicationCommandOptionTypes.User,
    required: true,
  },
  //   {
  //     name: "reason",
  //     description: "The reason for the unban",
  //     type: ApplicationCommandOptionTypes.String,
  //     minLength: 1,
  //     required: false,
  //   },
  {
    name: "visible",
    description: "Whether the unban message should be visible to everyone",
    type: ApplicationCommandOptionTypes.Boolean,
    required: false,
  },
];

createCommand({
  name: "unban",
  category: "moderation",
  description: "Unban a user from the server",
  scope: CommandScope.GLOBAL,
  dmPermission: false,
  defaultMemberPermissions: ["BAN_MEMBERS"],
  options,
  execute: async (ctx, i18n) => {
    const _userIdToUnban = ctx.args.getString("user")!;
    const userIdToUnban: bigint = ctx.bot.transformers.snowflake(
      _userIdToUnban,
    );

    const user = await getOrFetchUser(ctx.bot, userIdToUnban);

    await ctx.bot.helpers.unbanMember(ctx.guildId!, userIdToUnban);

    const isUnbanMessageVisible = ctx.args.getBoolean("visible") ?? false;

    await ctx.reply(
      makeBasePunishmentEmbed(i18n, user)
        .setTitle(
          i18n.translate("COMMAND.APP.UNBAN.UNBANEMBED.TITLE"),
        ),
      {
        private: !isUnbanMessageVisible,
      },
    );
  },
});
