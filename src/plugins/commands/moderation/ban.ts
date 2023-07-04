import {
  ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  Embed,
} from "deps";
import { createCommand } from "internals/loadStuff.ts";
import { CommandError, CommandScope } from "structures";
import { getOrFetchUser, parseTime, userUsernameAndDiscriminator } from "utils";

const options: ApplicationCommandOption[] = [
  {
    name: "user",
    description: "The user or user id to ban",
    type: ApplicationCommandOptionTypes.User,
    required: true,
  },
  {
    name: "reason",
    description: "The reason for the ban",
    type: ApplicationCommandOptionTypes.String,
    minLength: 1,
    required: false,
  },
  {
    name: "delete-message-history",
    description: "Delete message history of the user (Example: 2d, 10h5m)",
    type: ApplicationCommandOptionTypes.String,
    minLength: 2,
    required: false,
  },
  {
    name: "visible",
    description: "Whether the ban message should be visible to everyone",
    type: ApplicationCommandOptionTypes.Boolean,
    required: false,
  },
];

createCommand({
  name: "ban",
  category: "moderation",
  description: "Ban a user from the server",
  scope: CommandScope.GLOBAL,
  dmPermission: false,
  options,
  execute: async (ctx, i18n) => {
    const _userIdToBan = ctx.args.getString("user")!;
    const userIdToBan: bigint = ctx.bot.transformers.snowflake(_userIdToBan);

    const reason = ctx.args.getString("reason");

    const deleteMessageHistory = ctx.args.getString("delete-message-history");
    let parsedDeleteMessageHistoryTime: number | null | undefined = undefined;
    if (deleteMessageHistory) {
      parsedDeleteMessageHistoryTime = parseTime(deleteMessageHistory);
      if (parsedDeleteMessageHistoryTime === null) {
        return void await ctx.reply(
          i18n.translate("COMMAND.APP.BAN.PROVIDE_CORRECT_DELETE_MSG_HISTORY", [
            "(e.g.: 1d, 10m, 4h)",
          ]),
          { private: true },
        );
      }
    }

    const user = await getOrFetchUser(ctx.bot, userIdToBan);

    await ctx.bot.helpers.banMember(
      ctx.guildId!,
      userIdToBan,
      {
        deleteMessageSeconds: parsedDeleteMessageHistoryTime,
        reason,
      },
    );

    const isBanMessageVisible = ctx.args.getBoolean("visible") ?? false;
    const banEmbed: Embed = {
      title: i18n.translate("COMMAND.APP.BAN.BANEMBED.TITLE"),
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
    await ctx.reply({ embeds: [banEmbed] }, {
      private: !isBanMessageVisible,
    });
  },
});
