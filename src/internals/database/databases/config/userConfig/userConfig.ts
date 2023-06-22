import {
  BaseMongoCollectionWrapper,
  MongoCollectionWrapperParams,
  UserConfigSchema,
} from "db_structures";
import { BigString } from "deps";

class UserConfigColl extends BaseMongoCollectionWrapper<UserConfigSchema> {
  constructor(params: MongoCollectionWrapperParams) {
    const { bot, database } = params;
    super({ bot, database, name: "user_config" });
  }

  get(userId_: BigString): Promise<UserConfigSchema | undefined> {
    const userId = this.bot.transformers.reverse.snowflake(userId_);
    return this.collection.findOne({ userId });
  }

  set(userId_: BigString, update: Partial<UserConfigSchema>) {
    const userId = this.bot.transformers.reverse.snowflake(userId_);

    return this.collection.updateOne({ userId }, {
      $set: { userId, ...update },
    }, {
      upsert: true,
    });
  }
}

export { UserConfigColl };
