import { Interaction } from "deps";
import { customBot } from "bot";
import { getArgsLocaleKey, Locale, LocaleKeys } from "structures";

class I18nContext {
  locale: Locale;

  constructor(public interaction: Interaction) {
    this.locale = customBot.locales.get("cat-central") || (() => {
      throw new Error("Cannot find locale cat-central");
    })();
  }

  translate<K extends LocaleKeys>(
    key: K,
    params?: getArgsLocaleKey<K>,
  ) {
    return customBot.i18n.translate<K>(this.locale, key, params);
  }
}

export { I18nContext };
