import { CustomBot, DatabaseHandler, devModePrefix } from "internals";

interface BaseDatabaseWrapperParams {
  dbHandler: DatabaseHandler;
  name: string;
}
class BaseDatabaseWrapper {
  dbHandler: DatabaseHandler;
  name: string;
  bot: CustomBot;

  constructor(params: BaseDatabaseWrapperParams) {
    const { dbHandler, name } = params;
    const bot = dbHandler.bot;

    this.dbHandler = dbHandler;
    this.name = bot.config.devMode ? `${devModePrefix}${name}` : name;
    this.bot = bot;
  }
}

export { BaseDatabaseWrapper };
export type { BaseDatabaseWrapperParams };
