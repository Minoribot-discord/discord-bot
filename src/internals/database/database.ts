import { MongoClient } from "deps";
import { customBot } from "bot";

const logger = customBot.logger;
const config = customBot.config;

logger.info("Initializing database");
const mongoClient = new MongoClient();

await mongoClient.connect(config.mongo.url);

logger.info("Database initialized");

export { mongoClient };
