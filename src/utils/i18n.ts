import { cat_central } from "plugins/locales/cat_central.ts";
import { getArgsLocaleKey, Locale, LocaleKeys } from "structures";

export const globalDefaultLocale = cat_central;

export function translate<K extends LocaleKeys>(
  locale: Locale,
  key: K,
  params?: getArgsLocaleKey<K>,
): string {
  let value = locale
    // deno-lint-ignore no-explicit-any
    .keys[key] as string | ((...any: any[]) => string) | string[];

  if (!value) {
    // check if the key is available in the default locale
    if (locale.code !== globalDefaultLocale.code) {
      value = globalDefaultLocale.keys[key];
    }

    // if still not found, use the key itself as the value
    if (!value) value = key;
  }

  if (Array.isArray(value)) return value.join("\n");

  if (typeof value === "function") return value(...(params || []));

  return value;
}
