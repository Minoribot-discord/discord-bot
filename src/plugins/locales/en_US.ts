import { loadLocale } from "internals/loadStuff.ts";

loadLocale({
  code: "en_US",
  name: "American English",
  keys: {
    // Inhibitors
    "INHIBITOR.MISSING_CONDITIONS":
      "You cannot execute this command, missing conditions:",
    "INHIBITOR.IS_BOT_OWNER.REJECT":
      "This command is reserved for the bot owner",
    "INHIBITOR.IS_TARGET_MEMBER_EDITABLE.REJECT":
      "You cannot edit this user: They are admin, or server owner, or they're above you in the member's list",
    // Collectors
    "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE":
      "A new collector began before the user responded to the previous one.",
    "COLLECTORS.COMPONENTS.REJECT.TIMEOUT":
      "You didn't use the component in time.",
    "COLLECTORS.REACTIONS.REJECT.TIMEOUT": "You didn't react in time.",
    "COLLECTORS.MESSAGES.REJECT.TIMEOUT": "You didn't send a message in time.",
    // Global embed namespace
    "EMBED.PUNISHMENT.FIELDS.USER.NAME": "User",
    "EMBED.PUNISHMENT.FIELDS.REASON.NAME": "Reason",
    "EMBED.PUNISHMENT.FIELDS.REASON.VALUE.NO_REASON": "None",
    // Global command namespace
    "COMMAND.GLOBAL.ERRORS.PROVIDE_CORRECT_TIME":
      "You need to provide a correct time/duration. (e.g.: 1d, 10m, 4h)",
    "COMMAND.GLOBAL.ERRORS.PROVIDE_CORRECT_TIME_RANGE": (
      min: string,
      max: string,
    ) => `The time/duration needs to be between **${min}** and **${max}**`,
    // Application commands
    // Info command
    "COMMAND.APP.INFO.EMBED.TITLE": "Here are some information about the bot:",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.TITLE": "Server configuration",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.NAME": "Language",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.VALUE.DEFAULT_LANG":
      (
        langName: string,
      ) => `Default language (${langName})`,
    "COMMAND.APP.SETTINGS.SERVER.NEWLANGUAGE": (formattedLangName: string) =>
      `Language configurated successfully - ${formattedLangName}`,
    // Ban command
    "COMMAND.APP.BAN.BANEMBED.TITLE": "User banned",
    // Kick command
    "COMMAND.APP.KICK.KICKEMBED.TITLE": "User kicked",
    // Mute command
    "COMMAND.APP.MUTE.MUTEEMBED.TITLE": "User muted",
    "COMMAND.APP.MUTE.MUTEEMBED.FIELDS.DURATION.NAME": "Duration",
    // Unmute command
    "COMMAND.APP.UNMUTE.UNMUTEEMBED.TITLE": "User unmuted",
    // Unban command
    "COMMAND.APP.UNBAN.UNBANEMBED.TITLE": "User unbanned",
  },
});
