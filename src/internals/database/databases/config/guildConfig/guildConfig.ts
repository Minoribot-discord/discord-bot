import { BaseSchema, MongoCollectionWrapper } from "db_structures";
import { BigString, Database } from "deps";
import { CustomBot } from "internals";

interface GuildConfigSchema extends BaseSchema {
  guildId: string;
  locale?: string;
}

interface GuildConfigCollParams {
  bot: CustomBot;
  database: Database;
}

class GuildConfigColl extends MongoCollectionWrapper<GuildConfigSchema> {
  constructor(params: GuildConfigCollParams) {
    const { bot, database } = params;
    super({ bot, database, name: "guildConfig" });
  }

  getGuildConfig(guildId_: BigString): Promise<GuildConfigSchema> {
    const guildId = this.bot.transformers.reverse.snowflake(guildId_);
    return this.collection.findOne({ guildId });
  }

  setGuildConfig(guildId_: BigString, update: Partial<GuildConfigSchema>) {
    const guildId = this.bot.transformers.reverse.snowflake(guildId_);

    return this.collection.updateOne({ guildId }, { guildId, ...update }, {
      upsert: true,
    });
  }
}

export { GuildConfigColl };
