import { MongoClient } from "deps";
import { CustomBot } from "internals";
// import type { CustomBot } from "internals";

class DatabaseWrapper {
  dbClient!: MongoClient;

  resolveReady!: (value: void | Promise<void>) => void;
  ready: Promise<void> = new Promise<void>((res, _) => {
    this.resolveReady = res;
  });

  constructor(public bot: CustomBot) {}

  init() {
    this.bot.logger.info("Initializing database");
    const { mongo: { appId, appKey, clusterName } } = this.bot.config;
    this.dbClient = new MongoClient({
      endpoint: `https://data.mongodb-api.com/app/${appId}/endpoint/data/v1`,
      dataSource: clusterName, // e.g. "Cluster0"
      auth: {
        apiKey: appKey,
      },
    });

    this.bot.logger.info("Database initialized");
    this.resolveReady();
  }
}

export { DatabaseWrapper };
