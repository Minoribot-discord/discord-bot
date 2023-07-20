import { MongoClient } from "deps";
import { CustomBot } from "internals/CustomBot.ts";
import { configWrappers } from "database/databases/mod.ts";

export const mongoClient = new MongoClient();

export type DatabaseWrapper =
  & { mongoClient: MongoClient }
  & ReturnType<typeof configWrappers>;

export async function initDatabase(bot: CustomBot) {
  bot.logger.info("Connecting to the Mongo client");
  await mongoClient.connect(bot.config.mongo.url);
  bot.logger.info("Mongo client connected");

  const databaseWrapper: DatabaseWrapper = {
    mongoClient,
    ...configWrappers(bot, mongoClient),
  };

  return databaseWrapper;
}
