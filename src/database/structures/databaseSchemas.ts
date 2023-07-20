import { ObjectId } from "deps";

export interface BaseDocument {
  _id?: ObjectId;
}

export interface GuildConfigSchema extends BaseDocument {
  guildId: string;
  locale?: string;
}

export interface UserConfigSchema extends BaseDocument {
  userId: string;
  locale?: string;
}
