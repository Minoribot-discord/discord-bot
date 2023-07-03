import { loadLocale } from "internals/loadStuff.ts";

const cat_central = {
  code: "cat-central",
  name: "Català central estàndard",
  keys: {
    // Collectors
    "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE":
      "Un nou col·lector ha començat abans que l'usuari respongui a l'antic col·lector.",
    "COLLECTORS.COMPONENTS.REJECT.TIMEOUT":
      "No has utilitzat el component a temps.",
    "COLLECTORS.REACTIONS.REJECT.TIMEOUT": "No has reaccionat a temps.",
    "COLLECTORS.MESSAGES.REJECT.TIMEOUT": "No has enviat un missatge a temps.",
    // Application commands
    // Info command
    "COMMAND.APP.INFO.EMBED.TITLE":
      "Vet aquí informacions sobre el bot de Discord:",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.TITLE":
      "Configuració del servidor",
    // Settings command
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.NAME": "Llengua",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.VALUE.DEFAULT_LANG":
      (
        langName: string,
      ) => `La llenga per defecte (${langName})`,
    "COMMAND.APP.SETTINGS.SERVER.NEWLANGUAGE": (formattedLangName: string) =>
      `Llengua configurada amb èxit - ${formattedLangName}`,
    // Ban command
    "COMMAND.APP.BAN.PROVIDE_CORRECT_DELETE_MSG_HISTORY": (examples: string) =>
      `Necessiteu fornir un temps correcte. ${examples}`,
    "COMMAND.APP.BAN.BANEMBED.TITLE": "Usuari bandejat",
    "COMMAND.APP.BAN.BANEMBED.FIELDS.USER": "Usuari",
    "COMMAND.APP.BAN.BANEMBED.FIELDS.REASON": "Motiu",
    "COMMAND.APP.BAN.BANEMBED.FIELDS.REASON.NO_REASON": "Cap",
    // Kick command
    "COMMAND.APP.KICK.KICKEMBED.TITLE": "Usuari expulsat",
  },
};

loadLocale(cat_central);

export default cat_central;
