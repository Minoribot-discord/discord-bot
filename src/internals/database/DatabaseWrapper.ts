import { Database, MongoClient } from "deps";
import { CustomBot } from "internals";
// import type { CustomBot } from "internals";

class DatabaseWrapper {
  resolveReady!: (value: void | Promise<void>) => void;
  ready: Promise<void> = new Promise<void>((res, _) => {
    this.resolveReady = res;
  });

  dbClient!: MongoClient;
  database!: Database;

  constructor(public bot: CustomBot) {}

  init() {
    this.bot.logger.info("Initializing database");
    const { mongo: { appId, appKey, clusterName }, devMode } = this.bot.config;

    this.dbClient = new MongoClient({
      endpoint: `https://data.mongodb-api.com/app/${appId}/endpoint/data/v1`,
      dataSource: clusterName, // e.g. "Cluster0"
      auth: {
        apiKey: appKey,
      },
    });

    const devModePrefix = devMode ? "DEV_" : "";
    this.database = this.dbClient.database(`${devModePrefix}discord_bot`);

    this.bot.logger.info("Database initialized");
    this.resolveReady();
  }
}

export { DatabaseWrapper };
