import { MongoClient } from "deps";
import { logger } from "internals/logger.ts";
import { botConfig } from "config";
const mongoClient = new MongoClient();

await mongoClient.connect(botConfig.mongo.url);
logger.info("Mongo client connected");

export { mongoClient };
