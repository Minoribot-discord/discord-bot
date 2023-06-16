import { BotWithCache, BotWithHelpersPlugin, Collection } from "deps";
import { BotConfig } from "./config.ts";
import { logger } from "./logger.ts";
import {
  Command,
  CommandCategory,
  Inhibitor,
  Module,
  SubCommand,
  SubCommandGroup,
} from "structures";
import { DatabaseWrapper } from "database";

// custom type for the bot so we can add custom properties
type CustomBot = BotWithHelpersPlugin<BotWithCache> & {
  config: BotConfig;
  logger: typeof logger;
  database: DatabaseWrapper;
  modules: Collection<string, Module>;
  commands: Collection<string, Command>;
  subCommands: Collection<string, (SubCommandGroup | SubCommand)>;
  cmdCategories: Collection<string, CommandCategory>;
  inhibitors: Collection<string, Inhibitor>;
};

export type { CustomBot };
