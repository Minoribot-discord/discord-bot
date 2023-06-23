import {
  BaseMongoCollectionWrapper,
  GuildConfigSchema,
  MongoCollectionWrapperParams,
} from "db_structures";
import { BigString } from "deps";
import { customBot } from "internals";

class GuildConfigColl extends BaseMongoCollectionWrapper<GuildConfigSchema> {
  constructor(params: MongoCollectionWrapperParams) {
    const { database } = params;
    super({ database, name: "guild_config" });
  }

  get(guildId_: BigString): Promise<GuildConfigSchema | undefined> {
    const guildId = customBot.transformers.reverse.snowflake(guildId_);
    return this.collection.findOne({ guildId });
  }

  set(guildId_: BigString, update: Partial<GuildConfigSchema>) {
    const guildId = customBot.transformers.reverse.snowflake(guildId_);

    return this.collection.updateOne({ guildId }, {
      $set: { guildId, ...update },
    }, {
      upsert: true,
    });
  }
}

export { GuildConfigColl };
