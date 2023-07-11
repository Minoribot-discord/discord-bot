import { ApplicationCommandOption, ApplicationCommandOptionTypes } from "deps";
import { createCommand } from "internals/loadStuff.ts";
import { CommandScope } from "structures";
import { getOrFetchUser, makeBasePunishmentEmbed } from "utils";

const options: ApplicationCommandOption[] = [
  {
    name: "user",
    description: "The user or user id to kick",
    type: ApplicationCommandOptionTypes.User,
    required: true,
  },
  {
    name: "reason",
    description: "The reason for the kick",
    type: ApplicationCommandOptionTypes.String,
    minLength: 1,

    required: false,
  },
  {
    name: "visible",
    description: "Whether the kick message should be visible to everyone",
    type: ApplicationCommandOptionTypes.Boolean,
    required: false,
  },
];

createCommand({
  name: "kick",
  category: "moderation",
  description: "Kick a user from the server",
  scope: CommandScope.GLOBAL,
  dmPermission: false,
  defaultMemberPermissions: ["KICK_MEMBERS"],
  requiredBotPermissions: ["KICK_MEMBERS"],
  inhibitors: ["isTargetMemberEditable"],
  options,
  execute: async (ctx, i18n) => {
    const _userIdToKick = ctx.args.getString("user")!;
    const userIdToKick: bigint = ctx.bot.transformers.snowflake(_userIdToKick);

    const reason = ctx.args.getString("reason");

    const user = await getOrFetchUser(ctx.bot, userIdToKick);

    await ctx.bot.helpers.kickMember(
      ctx.guildId!,
      userIdToKick,
      reason,
    );

    const isKickMessageVisible = ctx.args.getBoolean("visible");

    await ctx.reply(
      makeBasePunishmentEmbed(i18n, user, reason)
        .setTitle(
          i18n.translate("COMMAND.APP.KICK.KICKEMBED.TITLE"),
        ),
      {
        private: !isKickMessageVisible,
      },
    );
  },
});
