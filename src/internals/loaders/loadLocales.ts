import { CustomBot, defaultLocaleCode } from "internals";
import { Locale } from "structures";
import { fs } from "deps";
const pathToLocaleDirectory = "plugins/locales";

async function loadLocales(bot: CustomBot) {
  bot.logger.info("Started loading locales");

  bot.locales.clear();

  for await (const walkEntry of fs.walk(`./src/${pathToLocaleDirectory}`)) {
    if (walkEntry.isFile) {
      const { default: locale_ } = await import(
        `../../../${walkEntry.path}`
      );
      if (!locale_ || typeof locale_ != "object") continue;

      const locale: Locale = locale_;

      bot.locales.set(locale.code, locale);
    }
  }

  if (!bot.locales.has(defaultLocaleCode)) {
    throw new Error(
      `default locale ${defaultLocaleCode} wasn't found after loading locales.\n` +
        "Check if the locale exists or if the locale code is written correctly on every side",
    );
  }
}

export { loadLocales };
