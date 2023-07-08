import { ApplicationCommandOption, ApplicationCommandOptionTypes } from "deps";
import { createCommand } from "internals/loadStuff.ts";
import { CommandScope } from "structures";
import {
  getOrFetchUser,
  makeBasePunishmentEmbed,
  parseTime,
  parseTimeAndCheckIfCorrect,
} from "utils";

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
    description: "Delete message history of the user (e.g.: 10h30m, 7d)",
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

const banMaxTimeRange = parseTime("7d");
if (!banMaxTimeRange) {
  throw new Error("banMaxTimeRange is null");
}

createCommand({
  name: "ban",
  category: "moderation",
  description: "Ban a user from the server",
  scope: CommandScope.GLOBAL,
  dmPermission: false,
  defaultMemberPermissions: ["BAN_MEMBERS"],
  options,
  execute: async (ctx, i18n) => {
    const _userIdToBan = ctx.args.getString("user")!;
    const userIdToBan: bigint = ctx.bot.transformers.snowflake(_userIdToBan);

    const reason = ctx.args.getString("reason");

    const deleteMessageHistory = ctx.args.getString("delete-message-history");
    let parsedDeleteMessageHistoryTime: number | null | undefined = undefined;
    if (deleteMessageHistory) {
      parsedDeleteMessageHistoryTime = await parseTimeAndCheckIfCorrect(
        ctx,
        i18n,
        deleteMessageHistory,
        { max: banMaxTimeRange },
      );
      if (parsedDeleteMessageHistoryTime === null) return;
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

    await ctx.reply(
      makeBasePunishmentEmbed(i18n, user, reason)
        .setTitle(
          i18n.translate("COMMAND.APP.BAN.BANEMBED.TITLE"),
        ),
      {
        private: !isBanMessageVisible,
      },
    );
  },
});
