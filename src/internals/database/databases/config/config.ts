import { BaseMongoDatabaseWrapper } from "db_structures";
import { DatabaseHandler } from "database";
import { GuildConfigColl, UserConfigColl } from "./collections.ts";

class ConfigDb extends BaseMongoDatabaseWrapper {
  guildConfig: GuildConfigColl;
  userConfig: UserConfigColl;

  constructor(dbHandler: DatabaseHandler) {
    super({ dbHandler, name: "config" });

    const collParams = {
      bot: this.bot,
      database: this.database,
    };

    this.guildConfig = new GuildConfigColl(collParams);
    this.userConfig = new UserConfigColl(collParams);
  }
}

export { ConfigDb };
