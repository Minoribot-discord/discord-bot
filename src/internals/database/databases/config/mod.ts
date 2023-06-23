import { BigString } from "deps";
import { databaseAddDevModePrefix } from "utils";
import { GuildConfigSchema } from "db_structures";
import { mongoClient } from "database/database.ts";
import { customBot } from "bot";

const reversedTransformers = customBot.transformers.reverse;

const configDb = mongoClient.database(
  databaseAddDevModePrefix(customBot.config.devMode, "config"),
);

const guildConfigCollection = configDb.collection<GuildConfigSchema>(
  "guildConfig",
);

const guildConfigWrapper = {
  getOne: (guildId: BigString) => {
    return guildConfigCollection.findOne({
      guildId: reversedTransformers.snowflake(guildId),
    });
  },
  setOne: (guildId: BigString, data: GuildConfigSchema) => {
    const guildId_ = reversedTransformers.snowflake(guildId);
    return guildConfigCollection.updateOne({ guildId: guildId_ }, {
      $set: { ...{ guildId: guildId_ }, ...data },
    });
  },
};

export {
  configDb,
  guildConfigCollection as guildConfigMongoCollection,
  guildConfigWrapper,
};
