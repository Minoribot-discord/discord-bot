import { loadLocale } from "internals/loadStuff.ts";

loadLocale({
  code: "en_US",
  name: "American English",
  keys: {
    // Inhibitors
    "INHIBITOR.MISSING_CONDITIONS": (formattedMissingConditions: string) =>
      `**You cannot execute this command, missing conditions:**${formattedMissingConditions}`,
    "INHIBITOR.IS_BOT_OWNER.REJECT":
      "This command is reserved for the bot owner",
    "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE":
      "A new collector began before the user responded to the previous one.",
    "COLLECTORS.COMPONENTS.REJECT.TIMEOUT":
      "You didn't use the component in time.",
    "COLLECTORS.REACTIONS.REJECT.TIMEOUT": "You didn't react in time.",
    "COLLECTORS.MESSAGES.REJECT.TIMEOUT": "You didn't send a message in time.",
    "COMMAND.APP.INFO.EMBED.TITLE": "Here are some information about the bot:",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.TITLE": "Server configuration",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.NAME": "Language",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.VALUE.DEFAULT_LANG":
      (
        langName: string,
      ) => `Default language (${langName})`,
    "COMMAND.APP.SETTINGS.SERVER.NEWLANGUAGE": (formattedLangName: string) =>
      `Language configurated successfully - ${formattedLangName}`,
  },
});
