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
import { GlobalConfig } from "internals";
import { collectors } from "utils";
import * as i18n from "utils/i18n.ts";
import { DatabaseWrapper } from "database/database.ts";

// custom type for the bot so we can add custom properties
export type CustomBot = Bot & {
  ready: boolean;
  config: GlobalConfig;
  ownerId: bigint;
  getBotUser: () => Promise<User>;
  db: DatabaseWrapper;
  i18n: typeof i18n;
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
