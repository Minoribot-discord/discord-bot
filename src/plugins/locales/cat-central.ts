import { loadLocale } from "internals/loadStuff.ts";

export const cat_central = {
  code: "cat-central",
  name: "Català central estàndard",
  keys: {
    // Inhibitors
    "INHIBITOR.MISSING_CONDITIONS":
      "No pots executar aquesta ordre, falten condicions:",
    "INHIBITOR.IS_BOT_OWNER.REJECT":
      "Aquesta ordre està reservada al propietari/a la propietària del bot",
    "INHIBITOR.IS_TARGET_MEMBER_EDITABLE.REJECT":
      "No pots editar aquest usuari: És admin, o és propietari del servidor, o és damunt teu dins de la llista dels membres",
    // Collectors
    "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE":
      "Un nou col·lector ha començat abans que un usuari respongui a l'antic col·lector.",
    "COLLECTORS.COMPONENTS.REJECT.TIMEOUT":
      "No has utilitzat el component a temps.",
    "COLLECTORS.REACTIONS.REJECT.TIMEOUT": "No has reaccionat a temps.",
    "COLLECTORS.MESSAGES.REJECT.TIMEOUT": "No has enviat un missatge a temps.",
    // Global embed namespace
    "EMBED.PUNISHMENT.FIELDS.USER.NAME": "Usuari",
    "EMBED.PUNISHMENT.FIELDS.REASON.NAME": "Motiu",
    "EMBED.PUNISHMENT.FIELDS.REASON.VALUE.NO_REASON": "Cap",
    // Global command namespace
    "COMMAND.GLOBAL.PROVIDE_CORRECT_TIME":
      "Has de fornir un temps/una duració correcte. (per exemple: 1d, 10m, 4h)",
    "COMMAND.GLOBAL.PROVIDE_CORRECT_TIME_RANGE": (min: string, max: string) =>
      `El temps/la duració ha de ser entre **${min}** i **${max}**`,
    // Application commands
    // Info command
    "COMMAND.APP.INFO.EMBED.TITLE":
      "Vet aquí informacions sobre el bot de Discord:",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.TITLE":
      "Configuració del servidor",
    // Settings command
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.NAME": "Llengua",
    "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.VALUE.DEFAULT_LANG":
      (langName: string) => `La llenga per defecte (${langName})`,
    "COMMAND.APP.SETTINGS.SERVER.NEWLANGUAGE": (formattedLangName: string) =>
      `Llengua configurada amb èxit - ${formattedLangName}`,
    // Ban command
    "COMMAND.APP.BAN.BANEMBED.TITLE": "Usuari bandejat",
    // Kick command
    "COMMAND.APP.KICK.KICKEMBED.TITLE": "Usuari expulsat",
    // Mute command
    "COMMAND.APP.MUTE.MUTEEMBED.TITLE": "Usuari silenciat",
    "COMMAND.APP.MUTE.MUTEEMBED.FIELDS.DURATION.NAME": "Duració",
    // Unmute command
    "COMMAND.APP.UNMUTE.UNMUTEEMBED.TITLE": "L'usuari ja no és silenciat",
  },
};

loadLocale(cat_central);
