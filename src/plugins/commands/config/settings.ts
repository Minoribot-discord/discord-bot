import {
  Embed,
  Interaction,
  InteractionResponseTypes,
  MessageComponentTypes,
  SelectMenuComponent,
  SelectOption,
} from "deps";
import {
  CollectFunc,
  CommandScope,
  ComponentCollectorOptions,
} from "structures";
import {
  createCommand,
  createSubCommand,
  createSubCommandGroup,
  locales,
} from "internals/loadStuff.ts";
import { awaitComponent } from "utils";

createCommand({
  name: "settings",
  category: "config",
  description: "Settings for the bot",
  defaultMemberPermissions: ["ADMINISTRATOR"],
  scope: CommandScope.GLOBAL,
  dmPermission: false,
});

const selectMenuLanguages: SelectMenuComponent = {
  type: MessageComponentTypes.SelectMenu,
  customId: "settings-set-language",
  options: locales.map<SelectOption>((locale) => ({
    label: locale.name,
    value: locale.code,
  })),
  placeholder: "Select a language",
};

createSubCommand("settings", {
  name: "server",
  description: "Settings for this server",
  execute: async (ctx, i18n) => {
    const guildId = ctx.guildId!;

    /*
      There is technically already a way to obtain the guild's locale via the context object
      But if for example there weren't any configured language, it'd give us the default locale

      However, if we do it that way (cf. the code below), we can know if there isn't any language set
    */
    const guildConfig = await ctx.bot.db.guildConfig.getOne(guildId);
    let guildLanguageName: string;
    if (guildConfig?.locale) {
      guildLanguageName = ctx.bot.locales.get(guildConfig.locale)!.name;
    } else {
      guildLanguageName = i18n.translate(
        "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.VALUE.DEFAULT_LANG",
        [ctx.bot.i18n.globalDefaultLocale.name],
      );
    }

    const configEmbed: Embed = {
      title: i18n.translate("COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.TITLE"),
      fields: [
        {
          name: i18n.translate(
            "COMMAND.APP.SETTINGS.SERVER.CONFIGEMBED.FIELDS.LANGUAGE.NAME",
          ),
          value: guildLanguageName,
        },
      ],
    };

    const reply = await ctx.reply({
      embeds: [configEmbed],
      components: [{
        components: [selectMenuLanguages],
        type: MessageComponentTypes.ActionRow,
      }],
    }, true);

    const filter: ComponentCollectorOptions["filter"] = (_bot, data) => {
      if (data.data?.customId) {
        return [selectMenuLanguages.customId].includes(data.data.customId);
      }
      return false;
    };
    const collect: CollectFunc<Interaction> = async (bot, data) => {
      const newLocaleCode = data.data?.values?.[0];
      if (!newLocaleCode) return;

      const newLocale = bot.locales.get(newLocaleCode);
      if (!newLocale) return;

      await bot.db.guildConfig.setOne(guildId, { locale: newLocale.code });

      const formattedLocaleName = `**${newLocale.name}**`;
      await bot.helpers.sendInteractionResponse(data.id, data.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: bot.i18n.translate(
            newLocale,
            "COMMAND.APP.SETTINGS.SERVER.NEWLANGUAGE",
            [formattedLocaleName],
          ) + "\n" +
            i18n.translate("COMMAND.APP.SETTINGS.SERVER.NEWLANGUAGE", [
              formattedLocaleName,
            ]),
        },
      });
      i18n.locale = newLocale;
    };

    await awaitComponent(reply!.id, { filter, collect, maxUsage: 50 });
  },
});
