import { z } from "deps";
import { webhookIdAndTokenSchema } from "zod_schemas/Webhook.ts";

export const discordConfigSchema = z.object({
  token: z.string(),
  ownerId: z.bigint(),
  supportGuildId: z.bigint(),
  intents: z.number(),
});
export type DiscordConfig = z.infer<typeof discordConfigSchema>;

export const mongoConfigSchema = z.object({
  url: z.string(),
});
export type MongoConfig = z.infer<typeof mongoConfigSchema>;

export const redisConfigSchema = z
  .object({
    cacheUrl: z.string().optional(),
  })
  .optional();
export type RedisConfig = z.infer<typeof redisConfigSchema>;

export const globalConfigSchema = z.object({
  refreshCommands: z.boolean(),
  devMode: z.boolean(),
  discord: discordConfigSchema,
  mongo: mongoConfigSchema,
  redis: redisConfigSchema,
  webhooks: z.record(webhookIdAndTokenSchema),
});
export type GlobalConfig = z.infer<typeof globalConfigSchema>;
