import { Database, MongoClient, ObjectId } from "deps";
import {
  BaseDatabaseWrapper,
  BaseDatabaseWrapperParams,
} from "./BaseDatabaseWrapper.ts";
import { MongoCollectionWrapper } from "./MongoCollectionWrapper.ts";

// deno-lint-ignore no-empty-interface
interface MongoDatabaseWrapperParams extends BaseDatabaseWrapperParams {}
class MongoDatabaseWrapper extends BaseDatabaseWrapper {
  mongo: MongoClient;
  database: Database;
  collections: Record<string, MongoCollectionWrapper> = {};

  constructor(params: MongoDatabaseWrapperParams) {
    super(params);
    this.mongo = this.dbHandler.mongo;

    console.log(this.name);

    this.database = this.mongo.database(this.name);
  }
}

export { MongoDatabaseWrapper };
