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
import { Command, SubCommand, SubCommandGroup } from "./classes/Command.ts";
import { CommandCategory } from "./classes/CommandCategory.ts";
const { discordToken, intents } = botConfig;

const baseBot = createBot({ token: discordToken, intents });
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
  loadedCommands: Collection<string, Command>;
  loadedSubCommands: Collection<string, (SubCommandGroup | SubCommand)>;
  loadedCmdCategories: Collection<string, CommandCategory>;
};

// implement the custom properties to the bot object
const customBot = botWithValidationsPlugin as CustomBot;
customBot.config = botConfig;
customBot.logger = logger;
customBot.loadedModules = new Collection();
customBot.loadedCommands = new Collection();
customBot.loadedSubCommands = new Collection();
customBot.loadedCmdCategories = new Collection();

export { customBot };
export type { CustomBot };
