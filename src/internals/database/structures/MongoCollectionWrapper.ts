import { Database, MongoCollection } from "deps";
import { BaseSchema } from "db_structures";
import { CustomBot } from "internals";

interface MongoCollectionWrapperParams {
  bot: CustomBot;
  database: Database;
  name: string;
}
class MongoCollectionWrapper<T extends BaseSchema = BaseSchema> {
  bot: CustomBot;
  database: Database;
  collection: MongoCollection<T>;
  name: string;

  constructor(params: MongoCollectionWrapperParams) {
    const { bot, database, name } = params;

    this.bot = bot;
    this.database = database;
    this.collection = database.collection(name);
    this.name = name;
  }
}

export { MongoCollectionWrapper };
export type { MongoCollectionWrapperParams };
