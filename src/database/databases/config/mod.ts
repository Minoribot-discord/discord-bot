import { BigString, MongoClient } from "deps";
import { databaseAddDevModePrefix } from "utils";
import { GuildConfigSchema, UserConfigSchema } from "db_structures";
import { CustomBot } from "internals/CustomBot.ts";

export function configWrappers(bot: CustomBot, mongoClient: MongoClient) {
  const reversedTransformers = bot.transformers.reverse;

  const configDb = mongoClient.database(
    databaseAddDevModePrefix(bot.config.devMode, "config"),
  );

  const guildConfigCollection = configDb.collection<GuildConfigSchema>(
    "guildConfig",
  );

  const guildConfig = {
    collection: guildConfigCollection,
    getOne: (guildId: BigString) => {
      return guildConfigCollection.findOne({
        guildId: reversedTransformers.snowflake(guildId),
      });
    },
    setOne: (guildId: BigString, data: Partial<GuildConfigSchema>) => {
      const guildId_ = reversedTransformers.snowflake(guildId);
      return guildConfigCollection.updateOne({ guildId: guildId_ }, {
        $set: { guildId: guildId_, ...data },
      }, {
        upsert: true,
      });
    },
  };

  const userConfigCollection = configDb.collection<UserConfigSchema>(
    "userConfig",
  );

  const userConfig = {
    collection: userConfigCollection,
    getOne: (userId: BigString) => {
      return userConfigCollection.findOne({
        userId: reversedTransformers.snowflake(userId),
      });
    },
    setOne: (userId: BigString, data: Partial<UserConfigSchema>) => {
      const userId_ = reversedTransformers.snowflake(userId);
      return userConfigCollection.updateOne({ userId: userId_ }, {
        $set: { userId: userId_, ...data },
      }, {
        upsert: true,
      });
    },
  };

  return {
    configDb,
    guildConfig,
    userConfig,
  };
}
