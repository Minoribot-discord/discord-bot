import { loadLocale } from "internals/loadStuff.ts";

const cat_central = {
  code: "cat-central",
  name: "Català central estàndard",
  keys: {
    "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE":
      "Un nou col·lector ha començat abans que l'usuari respongui a l'antic col·lector.",
    "COLLECTORS.COMPONENTS.REJECT.TIMEOUT":
      "No has utilitzat el component a temps.",
    "COLLECTORS.REACTIONS.REJECT.TIMEOUT": "No has reaccionat a temps.",
    "COLLECTORS.MESSAGES.REJECT.TIMEOUT": "No has enviat un missatge a temps.",
    "COMMAND.APP.INFO.EMBED.TITLE":
      "Vet aquí informacions sobre el bot de Discord:",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.TITLE":
      "Configuració del servidor",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.NAME": "Llengua",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.VALUE.DEFAULT_LANG":
      (
        langName: string,
      ) => `La llenga per defecte (${langName})`,
    "COMMAND.APP.SETTINGS.SERVER.NEWLANGUAGE": (formattedLangName: string) =>
      `Llengua configurada amb èxit - ${formattedLangName}`,
  },
};

loadLocale(cat_central);

export default cat_central;
