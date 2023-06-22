import { MongoClient } from "deps";
import { CustomBot } from "internals";
import { ConfigDb } from "./databases/databases_mod.ts";
// import type { CustomBot } from "internals";

const devModePrefix = "DEV_";

class DatabaseHandler {
  resolveReady!: (value: void | Promise<void>) => void;
  ready: Promise<void> = new Promise<void>((res, _) => {
    this.resolveReady = res;
  });

  mongo = new MongoClient();
  configDb!: ConfigDb;

  constructor(public bot: CustomBot) {}

  async init() {
    this.bot.logger.info("Initializing database");
    const { mongo: { url } } = this.bot.config;

    // this.mongo = new MongoClient({
    //   endpoint: `https://data.mongodb-api.com/app/${appId}/endpoint/data/v1`,
    //   dataSource: clusterName, // e.g. "Cluster0"
    //   auth: {
    //     apiKey: appKey,
    //   },
    // });
    await this.mongo.connect(url);

    this.configDb = new ConfigDb(this);

    this.bot.logger.info("Database initialized");
    this.resolveReady();
  }
}

export { DatabaseHandler, devModePrefix };
