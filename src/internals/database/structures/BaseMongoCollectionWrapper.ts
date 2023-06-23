import { Database, MongoCollection } from "deps";
import { BaseSchema } from "db_structures";

interface MongoCollectionWrapperParams {
  database: Database;
}

interface BaseMongoCollectionWrapperParams {
  database: Database;
  name: string;
}
class BaseMongoCollectionWrapper<T extends BaseSchema = BaseSchema> {
  database: Database;
  collection: MongoCollection<T>;
  name: string;

  constructor(params: BaseMongoCollectionWrapperParams) {
    const { database, name } = params;

    this.database = database;
    this.collection = database.collection(name);
    this.name = name;
  }
}

export { BaseMongoCollectionWrapper };
export type { BaseMongoCollectionWrapperParams, MongoCollectionWrapperParams };
