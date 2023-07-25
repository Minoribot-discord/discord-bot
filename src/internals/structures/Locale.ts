import { cat_central } from "plugins/locales/cat_central.ts";

export type LocaleKeys = keyof typeof cat_central.keys;

export type getArgsLocaleKey<K extends LocaleKeys> =
  typeof cat_central.keys[K] extends // deno-lint-ignore no-explicit-any
  (...any: any[]) => unknown ? Parameters<typeof cat_central.keys[K]>
    : [];

export type Locale = typeof cat_central;
