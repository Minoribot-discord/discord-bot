import { loadLocale } from "internals/loadStuff.ts";

export const cat_central = {
  code: "cat_central",
  name: "Català central estàndard",
  keys: {
    // Inhibitors
    "INHIBITOR.MISSING_CONDITIONS": (formattedMissingConditions: string) =>
      `**No pots executar aquesta ordre, falten condicions:**${formattedMissingConditions}`,
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
    "COMMAND.GLOBAL.ERRORS.PROVIDE_CORRECT_TIME":
      "Has de fornir un temps/una duració correcte. (per exemple: 1d, 10m, 4h)",
    "COMMAND.GLOBAL.ERRORS.PROVIDE_CORRECT_TIME_RANGE": (
      min: string,
      max: string,
    ) => `El temps/la duració ha de ser entre **${min}** i **${max}**`,
    "COMMAND.GLOBAL.MISSING_PERMISSIONS": (
      formattedMissingPermissions: string,
    ) =>
      `**Em falta un o més dels permisos següents, en aquest canal o en aquest servidor:**${formattedMissingPermissions}`,
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
    // Unban command
    "COMMAND.APP.UNBAN.UNBANEMBED.TITLE": "L'usuari ja no és bandejat",
    // // Discord permissions
    // "PERMISSION.CREATE_INSTANT_INVITE": "Crear invitacions",
    // "PERMISSION.KICK_MEMBERS": "Expulsar membres",
    // "PERMISSION.BAN_MEMBERS": "Bandejar membres",
    // "PERMISSION.ADMINISTRATOR": "Administrador",
    // "PERMISSION.MANAGE_CHANNELS": "Gestionar canals",
    // "PERMISSION.MANAGE_GUILD": "Gestionar servidor",
    // "PERMISSION.ADD_REACTIONS": "Afegir reaccions",
    // "PERMISSION.VIEW_AUDIT_LOG": "Veure el registre d'auditoria",
    // "PERMISSION.PRIORITY_SPEAKER": "Prioritat de paraula",
    // "PERMISSION.STREAM": "Vídeo",
    // "PERMISSION.VIEW_CHANNEL": "Veure canals",
    // "PERMISSION.SEND_MESSAGES": "Enviar missatges",
    // "PERMISSION.SEND_TTS_MESSAGES": "Enviar missatges de text a veu",
    // "PERMISSION.MANAGE_MESSAGES": "Gestionar missatges",
    // "PERMISSION.EMBED_LINKS": "Inserir enllaços",
    // "PERMISSION.ATTACH_FILES": "Adjuntar arxius",
    // "PERMISSION.READ_MESSAGE_HISTORY": "Llegir l'historial de missatges",
    // "PERMISSION.MENTION_EVERYONE":
    //   "Mencionar @ everyone, @ here i tots els rols",
    // "PERMISSION.USE_EXTERNAL_EMOJIS": undefined,
    // "PERMISSION.VIEW_GUILD_INSIGHTS": undefined,
    // "PERMISSION.CONNECT": undefined,
    // "PERMISSION.SPEAK": undefined,
    // "PERMISSION.MUTE_MEMBERS": undefined,
    // "PERMISSION.DEAFEN_MEMBERS": undefined,
    // "PERMISSION.MOVE_MEMBERS": undefined,
    // "PERMISSION.USE_VAD": undefined,
    // "PERMISSION.CHANGE_NICKNAME": undefined,
    // "PERMISSION.MANAGE_NICKNAMES": undefined,
    // "PERMISSION.MANAGE_ROLES": undefined,
    // "PERMISSION.MANAGE_WEBHOOKS": undefined,
    // "PERMISSION.MANAGE_EMOJIS_AND_STICKERS": undefined,
    // "PERMISSION.USE_SLASH_COMMANDS": undefined,
    // "PERMISSION.REQUEST_TO_SPEAK": undefined,
    // "PERMISSION.MANAGE_EVENTS": undefined,
    // "PERMISSION.MANAGE_THREADS": undefined,
    // "PERMISSION.CREATE_PUBLIC_THREADS": undefined,
    // "PERMISSION.CREATE_PRIVATE_THREADS": undefined,
    // "PERMISSION.USE_EXTERNAL_STICKERS": undefined,
    // "PERMISSION.SEND_MESSAGES_IN_THREADS": undefined,
    // "PERMISSION.USE_EMBEDDED_ACTIVITIES": undefined,
    // "PERMISSION.MODERATE_MEMBERS": undefined,
  },
};

loadLocale(cat_central);
