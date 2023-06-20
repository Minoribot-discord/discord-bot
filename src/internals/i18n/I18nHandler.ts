import { CustomBot, getArgsLocaleKey, Locale, LocaleKeys } from "internals";

const defaultLocaleCode = "cat-central";

class I18nHandler {
  globalDefaultLocale!: Locale;

  constructor(public bot: CustomBot) {}

  init() {
    this.bot.logger.info("Initializing i18n handler");

    const globalDefaultLocale = this.bot.locales.get(defaultLocaleCode);
    if (!globalDefaultLocale) {
      throw new Error(`Couldn't find default locale: ${defaultLocaleCode}`);
    }
    this.globalDefaultLocale = globalDefaultLocale;
  }

  translate<K extends LocaleKeys>(
    locale: Locale,
    key: K,
    params?: getArgsLocaleKey<K>,
  ): string {
    // deno-lint-ignore no-explicit-any
    let value: string | ((...any: any[]) => string) | string[] =
      locale.keys[key];

    if (!value) {
      // check if the key is available in the default locale
      if (locale.code !== defaultLocaleCode) {
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

export { defaultLocaleCode, I18nHandler };
