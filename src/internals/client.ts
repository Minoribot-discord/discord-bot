import { createBot } from "deps";
import { botConfig, discordConfig } from "config";
import { CustomBot, I18nHandler, tasks } from "internals";
import { collectors, getOrFetchUser } from "utils";
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
const customBot = baseBot as CustomBot;
customBot.ready = false;
customBot.config = botConfig;
customBot.ownerId = discordConfig.ownerId;
customBot.getBotUser = () => getOrFetchUser(customBot, customBot.id);
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

export const logger = customBot.logger;

export { customBot };
