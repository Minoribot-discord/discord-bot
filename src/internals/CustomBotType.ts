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
} from "./classes/classes.ts";

// custom type for the bot so we can add custom properties
type CustomBot = BotWithHelpersPlugin<BotWithCache> & {
  config: BotConfig;
  logger: typeof logger;
  loadedModules: Collection<string, Module>;
  loadedCommands: Collection<string, Command>;
  loadedSubCommands: Collection<string, (SubCommandGroup | SubCommand)>;
  loadedCmdCategories: Collection<string, CommandCategory>;
  loadedInhibitors: Collection<string, Inhibitor>;
};

export type { CustomBot };
