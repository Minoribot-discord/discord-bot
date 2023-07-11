import { ApplicationCommandOption, ApplicationCommandOptionTypes } from "deps";
import { createCommand } from "internals/loadStuff.ts";
import { CommandScope } from "structures";
import {
  formatTime,
  getOrFetchUser,
  makeBasePunishmentEmbed,
  parseTime,
  parseTimeAndCheckIfCorrect,
} from "utils";

const options: ApplicationCommandOption[] = [
  {
    name: "member",
    description: "The member to timeout",
    type: ApplicationCommandOptionTypes.User,
    required: true,
  },
  {
    name: "duration",
    description: "The duration of the timeout (e.g.: 15m, 7d)",
    type: ApplicationCommandOptionTypes.String,
    minLength: 2,
    required: true,
  },
  // Unused for now, might be used some day
  // {
  //   name: "reason",
  //   description: "The reason for the timeout",
  //   type: ApplicationCommandOptionTypes.String,
  //   required: false,
  // },
  {
    name: "visible",
    description: "Whether the timeout message should be visible to everyone",
    type: ApplicationCommandOptionTypes.Boolean,
    required: false,
  },
];

const muteMaxTimeRange = parseTime("7d");
if (!muteMaxTimeRange) {
  throw new Error("banMaxTimeRange is null");
}

createCommand({
  name: "mute",
  category: "moderation",
  description: "Mute a member (using the built-in Discord feature)",
  scope: CommandScope.GLOBAL,
  dmPermission: false,
  defaultMemberPermissions: ["MUTE_MEMBERS"],
  requiredBotPermissions: ["MUTE_MEMBERS"],
  inhibitors: ["isTargetMemberEditable"],
  options,
  execute: async (ctx, i18n) => {
    const _userIdToMute = ctx.args.getString("member")!;
    const userIdToMute: bigint = ctx.bot.transformers.snowflake(_userIdToMute);

    const duration = ctx.args.getString("duration")!;
    const parsedDurationSeconds = await parseTimeAndCheckIfCorrect(
      ctx,
      i18n,
      duration,
      { max: muteMaxTimeRange },
    );
    if (parsedDurationSeconds === null) return;
    if (parsedDurationSeconds === 0) {
      return await (ctx.bot.commands.get("unmute")!).execute!(ctx, i18n);
    }
    const parsedDurationMilliseconds = parsedDurationSeconds * 1000;

    const user = await getOrFetchUser(ctx.bot, userIdToMute);

    await ctx.bot.helpers.editMember(ctx.guildId!, userIdToMute, {
      communicationDisabledUntil: Date.now() + parsedDurationMilliseconds,
    });

    const isMuteMessageVisible = ctx.args.getBoolean("visible") ?? false;

    await ctx.reply(
      makeBasePunishmentEmbed(i18n, user)
        .setTitle(
          i18n.translate("COMMAND.APP.MUTE.MUTEEMBED.TITLE"),
        )
        .addField(
          i18n.translate(
            "COMMAND.APP.MUTE.MUTEEMBED.FIELDS.DURATION.NAME",
          ),
          `\`${formatTime(parsedDurationSeconds)}\``,
        ),
      {
        private: !isMuteMessageVisible,
      },
    );
  },
});
