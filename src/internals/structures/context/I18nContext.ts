import { Interaction } from "deps";
import { getArgsLocaleKey, Locale, LocaleKeys } from "structures";
import { CustomBot } from "internals/CustomBot.ts";

class I18nContext {
  locale: Locale;

  constructor(public bot: CustomBot, public interaction: Interaction) {
    this.locale = this.bot.i18n.globalDefaultLocale;
  }

  async initLocale(): Promise<this> {
    const guildId = this.interaction.guildId;
    if (guildId) {
      const guildLocaleCode = (await this.bot.db.guildConfig.getOne(guildId))
        ?.locale;
      if (guildLocaleCode) {
        const guildLocale = this.bot.locales.get(guildLocaleCode);

        if (!guildLocale) {
          await this.bot.db.guildConfig.setOne(guildId, { locale: undefined });
        } else {
          this.locale = guildLocale;
        }
      }
    }

    if (!this.locale) {
      this.locale = this.bot.i18n.globalDefaultLocale;
    }

    return this;
  }

  translate<K extends LocaleKeys>(
    key: K,
    params?: getArgsLocaleKey<K>,
  ) {
    return this.bot.i18n.translate<K>(this.locale, key, params);
  }
}

export { I18nContext };
