import { BotWithCache, BotWithHelpersPlugin, Collection } from "deps";
import {
  Command,
  CommandCategory,
  Inhibitor,
  Locale,
  Module,
  SubCommand,
  SubCommandGroup,
} from "structures";
import { BotConfig, DatabaseWrapper, I18nHandler, logger } from "internals";

// custom type for the bot so we can add custom properties
type CustomBot = BotWithHelpersPlugin<BotWithCache> & {
  config: BotConfig;
  logger: typeof logger;
  database: DatabaseWrapper;
  i18n: I18nHandler;
  modules: Collection<string, Module>;
  commands: Collection<string, Command>;
  subCommands: Collection<string, (SubCommandGroup | SubCommand)>;
  cmdCategories: Collection<string, CommandCategory>;
  locales: Collection<string, Locale>;
  inhibitors: Collection<string, Inhibitor>;
};

export type { CustomBot };
