import { ObjectId } from "deps";

interface BaseSchema {
  _id?: ObjectId;
}

interface GuildConfigSchema extends BaseSchema {
  guildId: string;
  locale?: string;
}

interface UserConfigSchema extends BaseSchema {
  userId: string;
  locale?: string;
}

export type { BaseSchema, GuildConfigSchema, UserConfigSchema };
