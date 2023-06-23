import { ObjectId } from "deps";

interface BaseDocument {
  _id?: ObjectId;
}

interface GuildConfigSchema extends BaseDocument {
  guildId: string;
  locale?: string;
}

interface UserConfigSchema extends BaseDocument {
  userId: string;
  locale?: string;
}

export type { BaseDocument, GuildConfigSchema, UserConfigSchema };
