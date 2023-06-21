import { Database, MongoCollection } from "deps";
import { BaseSchema } from "db_structures";
import { CustomBot } from "internals";

interface MongoCollectionWrapperParams {
  bot: CustomBot;
  database: Database;
}

interface BaseMongoCollectionWrapperParams {
  bot: CustomBot;
  database: Database;
  name: string;
}
class BaseMongoCollectionWrapper<T extends BaseSchema = BaseSchema> {
  bot: CustomBot;
  database: Database;
  collection: MongoCollection<T>;
  name: string;

  constructor(params: BaseMongoCollectionWrapperParams) {
    const { bot, database, name } = params;

    this.bot = bot;
    this.database = database;
    this.collection = database.collection(name);
    this.name = name;
  }
}

export { BaseMongoCollectionWrapper };
export type { BaseMongoCollectionWrapperParams, MongoCollectionWrapperParams };
