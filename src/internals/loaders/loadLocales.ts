import { CustomBot, defaultLocaleCode } from "internals";
import { Locale } from "structures";
import { fs } from "deps";
const pathToLocalDirectory = "plugins/locales";

async function loadLocales(bot: CustomBot) {
  bot.logger.info("Started loading locales");

  bot.locales.clear();

  for await (const walkEntry of fs.walk(`./src/${pathToLocalDirectory}`)) {
    if (walkEntry.isFile) {
      const { default: local_ } = await import(
        `../../../${walkEntry.path}`
      );

      const local: Locale = local_;

      bot.locales.set(local.code, local);
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
