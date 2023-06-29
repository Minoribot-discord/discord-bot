import { customBot, getArgsLocaleKey, Locale, LocaleKeys } from "internals";

const botDefaultLocale = "cat-central";

class I18nHandler {
  globalDefaultLocale!: Locale;

  constructor() {}

  init() {
    customBot.logger.info("Initializing i18n handler");

    const globalDefaultLocale = customBot.locales.get(botDefaultLocale);
    if (!globalDefaultLocale) {
      throw new Error(`Couldn't find default locale: ${botDefaultLocale}`);
    }
    this.globalDefaultLocale = globalDefaultLocale;
  }

  translate<K extends LocaleKeys>(
    locale: Locale,
    key: K,
    params?: getArgsLocaleKey<K>,
  ): string {
    let value = locale
      // deno-lint-ignore no-explicit-any
      .keys[key] as string | ((...any: any[]) => string) | string[];

    if (!value) {
      // check if the key is available in the default locale
      if (locale.code !== botDefaultLocale) {
        value = this.globalDefaultLocale.keys[key];
      }

      // if still not found, use the key itself as the value
      if (!value) value = key;
    }

    if (Array.isArray(value)) return value.join("\n");

    if (typeof value === "function") return value(...(params || []));

    return value;
  }
}
export const i18nHandler = new I18nHandler();

export { botDefaultLocale, I18nHandler };
