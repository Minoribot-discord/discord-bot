import { MongoDatabaseWrapper } from "db_structures";
import { DatabaseHandler } from "database";

class ConfigDb extends MongoDatabaseWrapper {
  collections = {};
  constructor(dbHandler: DatabaseHandler) {
    super({ dbHandler, name: "config" });
  }
}

export { ConfigDb };
