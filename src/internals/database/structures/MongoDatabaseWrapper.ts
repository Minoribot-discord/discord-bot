import { Database, MongoClient } from "deps";
import {
  BaseDatabaseWrapper,
  BaseDatabaseWrapperParams,
  MongoCollectionWrapper,
} from "db_structures";

// deno-lint-ignore no-empty-interface
interface MongoDatabaseWrapperParams extends BaseDatabaseWrapperParams {}
class MongoDatabaseWrapper extends BaseDatabaseWrapper {
  mongo: MongoClient;
  database: Database;
  colls: Record<string, MongoCollectionWrapper> = {};

  constructor(params: MongoDatabaseWrapperParams) {
    super(params);
    this.mongo = this.dbHandler.mongo;

    console.log(this.name);

    this.database = this.mongo.database(this.name);
  }
}

export { MongoDatabaseWrapper };
