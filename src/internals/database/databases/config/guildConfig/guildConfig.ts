import { BaseSchema, MongoCollectionWrapper } from "db_structures";
import { Database } from "deps";

interface GuildConfigSchema extends BaseSchema {
  locale?: string;
}

class GuildConfigColl extends MongoCollectionWrapper<GuildConfigSchema> {
  constructor(database: Database) {
    super({ database, name: "guildConfig" });
  }

  async getGuildConfig() {
  }
}

export { GuildConfigColl };
