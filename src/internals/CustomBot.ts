import { Bot, Collection, User } from "deps";
import {
  Command,
  CommandCategory,
  Inhibitor,
  Locale,
  Module,
  RunningTasks,
  SubCommand,
  SubCommandGroup,
  Task,
} from "structures";
import { BotConfig, I18nHandler } from "internals";
import { collectors } from "utils";
import { DatabaseWrapper } from "database/database.ts";

// custom type for the bot so we can add custom properties
type CustomBot = Bot & {
  ready: boolean;
  config: BotConfig;
  ownerId: bigint;
  getBotUser: () => Promise<User>;
  db: DatabaseWrapper;
  i18n: I18nHandler;
  collectors: typeof collectors;
  modules: Collection<string, Module>;
  commands: Collection<string, Command>;
  subCommands: Collection<string, (SubCommandGroup | SubCommand)>;
  cmdCategories: Collection<string, CommandCategory>;
  locales: Collection<string, Locale>;
  inhibitors: Collection<string, Inhibitor>;
  tasks: Collection<string, Task>;
  runningTasks: RunningTasks;
};

export type { CustomBot };
