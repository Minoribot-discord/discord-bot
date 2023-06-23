import { customBot, DatabaseHandler, devModePrefix } from "internals";

interface BaseDatabaseWrapperParams {
  dbHandler: DatabaseHandler;
  name: string;
}
class BaseDatabaseWrapper {
  dbHandler: DatabaseHandler;
  name: string;

  constructor(params: BaseDatabaseWrapperParams) {
    const { dbHandler, name } = params;

    this.dbHandler = dbHandler;
    this.name = customBot.config.devMode ? `${devModePrefix}${name}` : name;
  }
}

export { BaseDatabaseWrapper };
export type { BaseDatabaseWrapperParams };
