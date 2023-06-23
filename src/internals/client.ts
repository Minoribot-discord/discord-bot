import {
  Collection,
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  enableHelpersPlugin,
  enablePermissionsPlugin,
  enableValidationsPlugin,
} from "deps";
import { botConfig } from "config";
import { CustomBot, i18nHandler, logger } from "internals";
const { discordToken, intents } = botConfig;

const baseBot = createBot({ token: discordToken, intents });
const botWithCache = enableCachePlugin(baseBot);
enableCacheSweepers(botWithCache);
const botWithHelpersPlugin = enableHelpersPlugin(botWithCache);
const botWithPermissionsPlugin = enablePermissionsPlugin(botWithHelpersPlugin);
const botWithValidationsPlugin = enableValidationsPlugin(
  botWithPermissionsPlugin,
);

// implement the custom properties to the bot object
const customBot = botWithValidationsPlugin as CustomBot;
customBot.config = botConfig;
customBot.logger = logger;
customBot.i18n = i18nHandler;
customBot.modules = new Collection();
customBot.commands = new Collection();
customBot.subCommands = new Collection();
customBot.cmdCategories = new Collection();
customBot.locales = new Collection();
customBot.inhibitors = new Collection();

export { customBot };
