import { loadLocale } from "internals/loadStuff.ts";

loadLocale({
  code: "en-US",
  name: "American English",
  keys: {
    // Collectors
    "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE":
      "A new collector began before the user responded to the previous one.",
    "COLLECTORS.COMPONENTS.REJECT.TIMEOUT":
      "You didn't use the component in time.",
    "COLLECTORS.REACTIONS.REJECT.TIMEOUT": "You didn't react in time.",
    "COLLECTORS.MESSAGES.REJECT.TIMEOUT": "You didn't send a message in time.",
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
    "COMMAND.APP.BAN.PROVIDE_CORRECT_DELETE_MSG_HISTORY": (examples: string) =>
      `You need to provide a correct time. ${examples}`,
    "COMMAND.APP.BAN.BANEMBED.TITLE": "User banned",
    "COMMAND.APP.BAN.BANEMBED.FIELDS.USER": "User",
    "COMMAND.APP.BAN.BANEMBED.FIELDS.REASON": "Reason",
    "COMMAND.APP.BAN.BANEMBED.FIELDS.REASON.NO_REASON": "None",
    // Kick command
    "COMMAND.APP.KICK.KICKEMBED.TITLE": "User kicked",
  },
});
