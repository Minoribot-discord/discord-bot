import { cat_central } from "plugins/locales/cat_central.ts";

type LocaleKeys = keyof typeof cat_central.keys;

type getArgsLocaleKey<K extends LocaleKeys> = typeof cat_central.keys[K] extends
  // deno-lint-ignore no-explicit-any
  (...any: any[]) => unknown ? Parameters<typeof cat_central.keys[K]>
  : [];

type Locale = typeof cat_central;

export type { getArgsLocaleKey, Locale, LocaleKeys };
