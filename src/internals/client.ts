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
customBot.loadedModules = new Collection();
customBot.loadedCommands = new Collection();
customBot.loadedSubCommands = new Collection();
customBot.loadedCmdCategories = new Collection();
customBot.loadedInhibitors = new Collection();

export { customBot };
