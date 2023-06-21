import { Database, MongoClient } from "deps";
import {
  BaseDatabaseWrapper,
  BaseDatabaseWrapperParams,
  BaseMongoCollectionWrapper,
} from "db_structures";

// deno-lint-ignore no-empty-interface
interface BaseMongoDatabaseWrapperParams extends BaseDatabaseWrapperParams {}
class BaseMongoDatabaseWrapper extends BaseDatabaseWrapper {
  mongo: MongoClient;
  database: Database;
  colls: Record<string, BaseMongoCollectionWrapper> = {};

  constructor(params: BaseMongoDatabaseWrapperParams) {
    super(params);
    this.mongo = this.dbHandler.mongo;

    this.database = this.mongo.database(this.name);
  }
}

export { BaseMongoDatabaseWrapper };
