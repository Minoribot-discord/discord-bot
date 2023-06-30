import {
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  enableHelpersPlugin,
  enablePermissionsPlugin,
  enableValidationsPlugin,
} from "deps";
import { botConfig } from "config";
import { collectors, CustomBot, I18nHandler, logger, tasks } from "internals";
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
customBot.ready = false;
customBot.config = botConfig;
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
