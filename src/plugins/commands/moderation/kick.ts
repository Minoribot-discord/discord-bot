import {
  ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  Embed,
} from "deps";
import { createCommand } from "internals/loadStuff.ts";
import { CommandError, CommandScope } from "structures";
import { getOrFetchUser, userUsernameAndDiscriminator } from "utils";

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
    description: "Show the ban message or not",
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
  options,
  execute: async (ctx, i18n) => {
    const _userIdToKick = ctx.args.getString("user");
    if (!_userIdToKick) {
      throw new CommandError("No 'user' was provided??");
    }
    const userIdToKick: bigint = ctx.bot.transformers.snowflake(_userIdToKick);

    const reason = ctx.args.getString("reason");

    const user = await getOrFetchUser(ctx.bot, userIdToKick);

    await ctx.bot.helpers.kickMember(
      ctx.guildId!,
      userIdToKick,
      reason,
    );

    const isKickMessageVisible = ctx.args.getBoolean("visible");
    const kickEmbed: Embed = {
      title: i18n.translate("COMMAND.APP.KICK.KICKEMBED.TITLE"),
      fields: [
        {
          name: i18n.translate("COMMAND.APP.BAN.BANEMBED.FIELDS.USER"),
          value: `\`${userUsernameAndDiscriminator(user)}\`` +
            `\n<@${user.id}>\n\`${user.id}\``,
        },
        {
          name: i18n.translate("COMMAND.APP.BAN.BANEMBED.FIELDS.REASON"),
          value: `\`${reason}\`` ??
            i18n.translate("COMMAND.APP.BAN.BANEMBED.FIELDS.REASON.NO_REASON"),
        },
      ],
    };
    await ctx.reply({ embeds: [kickEmbed] }, {
      private: !isKickMessageVisible,
    });
  },
});
