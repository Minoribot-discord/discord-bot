import {
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  enableHelpersPlugin,
  enablePermissionsPlugin,
  enableValidationsPlugin,
} from "deps";
import { botConfig } from "config";
import { CustomBot, I18nHandler, logger, tasks } from "internals";
import { collectors } from "utils";
import {
  commandCategories,
  commands,
  inhibitors,
  locales,
  modules,
  runningTasks,
  subCommands,
} from "internals/loadStuff.ts";
const { discordToken, intents } = botConfig;

const botId = BigInt(atob(discordToken.split(".")[0]));

const baseBot = createBot({ token: discordToken, intents, botId });
const botWithCache = enableCachePlugin(baseBot);
enableCacheSweepers(botWithCache);
const botWithHelpersPlugin = enableHelpersPlugin(botWithCache);
const botWithPermissionsPlugin = enablePermissionsPlugin(botWithHelpersPlugin);
const botWithValidationsPlugin = enableValidationsPlugin(
  botWithPermissionsPlugin,
);

// implement the custom properties to the bot object
const customBot = botWithValidationsPlugin as CustomBot;
customBot.ready = false;
customBot.config = botConfig;
customBot.ownerId = botConfig.ownerId;
customBot.logger = logger;
customBot.i18n = new I18nHandler(customBot);
customBot.collectors = collectors;
customBot.modules = modules;
customBot.commands = commands;
customBot.subCommands = subCommands;
customBot.cmdCategories = commandCategories;
customBot.locales = locales;
customBot.inhibitors = inhibitors;
customBot.tasks = tasks;
customBot.runningTasks = runningTasks;

export { customBot };
