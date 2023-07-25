import { Bot, Collection, logger, User } from "deps";
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
import { GlobalConfig, I18nHandler } from "internals";
import { collectors } from "utils";
import { DatabaseWrapper } from "database/database.ts";

type CustomLogger = Omit<typeof logger, "error"> & {
  // deno-lint-ignore no-explicit-any
  error: (sendToWebhook: boolean, ...args: any[]) => void;
};

// custom type for the bot so we can add custom properties
export type CustomBot = Omit<Bot, "logger"> & { logger: CustomLogger } & {
  ready: boolean;
  config: GlobalConfig;
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
