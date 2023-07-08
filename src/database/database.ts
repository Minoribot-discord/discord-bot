import { MongoClient } from "deps";
import { CustomBot } from "internals/CustomBot.ts";
import { configWrappers } from "database/databases/mod.ts";

const mongoClient = new MongoClient();

type DatabaseWrapper =
  & { mongoClient: MongoClient }
  & ReturnType<typeof configWrappers>;

async function initDatabase(bot: CustomBot) {
  bot.logger.info("Connecting to the Mongo client");
  await mongoClient.connect(bot.config.mongo.url);
  bot.logger.info("Mongo client connected");

  const databaseWrapper: DatabaseWrapper = {
    mongoClient,
    ...configWrappers(bot, mongoClient),
  };

  return databaseWrapper;
}

export { initDatabase, mongoClient };
export type { DatabaseWrapper };
