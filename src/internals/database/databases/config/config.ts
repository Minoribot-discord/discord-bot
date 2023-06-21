import { MongoDatabaseWrapper } from "db_structures";
import { DatabaseHandler } from "database";
import { GuildConfigColl } from "./guildConfig/guildConfig.ts";

class ConfigDb extends MongoDatabaseWrapper {
  colls: {
    guildConfig: GuildConfigColl;
  };
  constructor(dbHandler: DatabaseHandler) {
    super({ dbHandler, name: "config" });

    this.colls = {
      guildConfig: new GuildConfigColl({
        bot: this.bot,
        database: this.database,
      }),
    };
  }
}

export { ConfigDb };
