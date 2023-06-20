import { Database, MongoCollection, ObjectId } from "deps";
import { BaseSchema } from "./BaseSchema.ts";

interface MongoCollectionWrapperParams {
  database: Database;
  name: string;
}
class MongoCollectionWrapper<T extends BaseSchema = BaseSchema> {
  database: Database;
  collection: MongoCollection<T>;
  name: string;

  constructor(params: MongoCollectionWrapperParams) {
    const { database, name } = params;

    this.database = database;
    this.collection = database.collection(name);
    this.name = name;
  }
}

export { MongoCollectionWrapper };
export type { MongoCollectionWrapperParams };
