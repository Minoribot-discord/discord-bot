import { mongo_atlas_sdk } from "deps";
import { botConfig } from "internals";
const { MongoClient } = mongo_atlas_sdk;

const { mongo: { appId, appKey, clusterName } } = botConfig;

const dbClient = new MongoClient({
  endpoint: `https://data.mongodb-api.com/app/${appId}/endpoint/data/v1`,
  dataSource: clusterName, // e.g. "Cluster0"
  auth: {
    apiKey: appKey,
  },
});

export { dbClient };
