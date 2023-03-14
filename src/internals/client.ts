import { BotConfig, botConfig } from "./config.ts";
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
import { Module } from "./loadModules.ts";
const { discordToken } = botConfig;

const baseBot = createBot({ token: discordToken });
const botWithCache = enableCachePlugin(baseBot);
enableCacheSweepers(botWithCache);
const botWithHelpersPlugin = enableHelpersPlugin(botWithCache);
const botWithPermissionsPlugin = enablePermissionsPlugin(botWithHelpersPlugin);
const botWithValidationsPlugin = enableValidationsPlugin(
  botWithPermissionsPlugin,
);

// custom type for the bot so we can add custom properties
type CustomBot = typeof botWithValidationsPlugin & {
  config: BotConfig;
  logger: typeof logger;
  loadedModules: Collection<string, Module>;
  loadedCommands: Collection<string, any>;
  loadedCmdCategories: Collection<string, any>;
};

// implement the custom properties to the bot object
const customBot = botWithValidationsPlugin as CustomBot;
customBot.config = botConfig;
customBot.logger = logger;
customBot.loadedModules = new Collection<string, Module>();
customBot.loadedCommands = new Collection<string, any>();
customBot.loadedCmdCategories = new Collection<string, any>();

export { customBot };
export type { CustomBot };
