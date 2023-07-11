import { ApplicationCommandOption, ApplicationCommandOptionTypes } from "deps";
import { createCommand } from "internals/loadStuff.ts";
import { CommandScope } from "structures";
import { getOrFetchUser, makeBasePunishmentEmbed } from "utils";

const options: ApplicationCommandOption[] = [
  {
    name: "member",
    description: "The member to unmute",
    type: ApplicationCommandOptionTypes.User,
    required: true,
  },
  {
    name: "visible",
    description: "Whether the unmute message should be visible to everyone",
    type: ApplicationCommandOptionTypes.Boolean,
    required: false,
  },
];

createCommand({
  name: "unmute",
  category: "moderation",
  description: "Unmute a member (using the built-in Discord feature)",
  scope: CommandScope.GLOBAL,
  dmPermission: false,
  defaultMemberPermissions: ["MUTE_MEMBERS"],
  requiredBotPermissions: ["MUTE_MEMBERS"],
  inhibitors: ["isTargetMemberEditable"],
  options,
  execute: async (ctx, i18n) => {
    const _userIdToUnmute = ctx.args.getString("member")!;
    const userIdToUnmute: bigint = ctx.bot.transformers.snowflake(
      _userIdToUnmute,
    );

    const user = await getOrFetchUser(ctx.bot, userIdToUnmute);

    await ctx.bot.helpers.editMember(ctx.guildId!, userIdToUnmute, {
      communicationDisabledUntil: 0,
    });

    const isUnmuteMessageVisible = ctx.args.getBoolean("visible");

    await ctx.reply(
      makeBasePunishmentEmbed(i18n, user)
        .setTitle(i18n.translate("EMBED.PUNISHMENT.FIELDS.USER.NAME")),
      {
        private: !isUnmuteMessageVisible,
      },
    );
  },
});
