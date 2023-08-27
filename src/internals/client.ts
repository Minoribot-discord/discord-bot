import { Bot, createBot, OpenWeatherClient } from "deps";
import { botConfig, discordConfig, openWeatherConfig } from "config";
import { CustomBot, tasks } from "internals";
import { collectors, getOrFetchUser } from "utils";
import * as i18n from "utils/i18n.ts";
import {
  commandCategories,
  commands,
  inhibitors,
  locales,
  modules,
  runningTasks,
  subCommands,
} from "internals/loadStuff.ts";
const { token, intents } = discordConfig;

const baseBot = createBot({ token, intents, events: {} });

// implement the custom properties to the bot object
export const customBot = createCustomBot(baseBot);

export const logger = customBot.logger;

function createCustomBot(bot: Bot): CustomBot {
  const customBot = bot as CustomBot;

  // Add custom properties
  customBot.ready = false;
  customBot.config = botConfig;
  customBot.ownerId = discordConfig.ownerId;
  customBot.getBotUser = () => getOrFetchUser(customBot, customBot.id);
  customBot.i18n = i18n;
  customBot.collectors = collectors;
  customBot.modules = modules;
  customBot.commands = commands;
  customBot.subCommands = subCommands;
  customBot.cmdCategories = commandCategories;
  customBot.locales = locales;
  customBot.inhibitors = inhibitors;
  customBot.tasks = tasks;
  customBot.runningTasks = runningTasks;

  return customBot;
}

export const openWeatherClient = new OpenWeatherClient({
  apiKey: openWeatherConfig.apiKey,
  apiUrl: openWeatherConfig.apiUrl,
  defaults: {
    units: "metric",
  },
});
