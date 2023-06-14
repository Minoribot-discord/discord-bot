import { botConfig } from "./config.ts";
import { logger } from "./logger.ts";
import {
  Collection,
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  enableHelpersPlugin,
  enablePermissionsPlugin,
  enableValidationsPlugin,
} from "deps";
import { CustomBot } from "./CustomBotType.ts";
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
customBot.modules = new Collection();
customBot.commands = new Collection();
customBot.subCommands = new Collection();
customBot.cmdCategories = new Collection();
customBot.inhibitors = new Collection();

export { customBot };
