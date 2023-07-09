import {
  CustomBot,
  defaultLocale,
  getArgsLocaleKey,
  Locale,
  LocaleKeys,
} from "internals";

class I18nHandler {
  globalDefaultLocale = defaultLocale;

  constructor(public bot: CustomBot) {}

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
      if (locale.code !== this.globalDefaultLocale.code) {
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

export { I18nHandler };
