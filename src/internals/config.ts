// deno-lint-ignore-file no-explicit-any
import { dotenv, snowflakeToBigint, toml } from "deps";
import { RecursivePartial } from "structures";
import {
  GlobalConfig,
  globalConfigSchema,
  Json,
  jsonSchema,
} from "zod_schemas";
import { transformGatewayIntentKeysToBitfield } from "../utils/misc.ts";

const rawToml = await Deno.readTextFile("./config.toml");
const parsedToml = jsonSchema.parse(toml.parse(rawToml)) as {
  [key: string]: Json;
};

// type EnvKey =
//   | "DISCORD_TOKEN"
//   | "MONGO_URL"
//   | "REDIS_CACHE_URL";
// type EnvKeys = {
//   [key in EnvKey]?: string;
// };
await dotenv.load({
  export: true,
  examplePath: null,
});

const unparsedDiscordConfig: Record<string, unknown> | undefined = {
  token: Deno.env.get("DISCORD_TOKEN") ||
    (parsedToml?.discord as any)?.token,
  ownerId: (parsedToml?.discord as any)?.ownerId &&
      typeof (parsedToml?.discord as any).ownerId === "string"
    ? snowflakeToBigint((parsedToml?.discord as any).ownerId as string)
    : undefined,
  supportGuildId: (parsedToml?.discord as any)?.supportGuildId &&
      typeof (parsedToml?.discord as any).supportGuildId === "string"
    ? snowflakeToBigint(
      (parsedToml?.discord as any).supportGuildId as string,
    )
    : undefined,
  intents: "intents" in (parsedToml?.discord as any) &&
      Array.isArray((parsedToml?.discord as any).intents)
    ? transformGatewayIntentKeysToBitfield(
      (parsedToml?.discord as any).intents,
    )
    : undefined,
};

const unparsedMongoConfig: Record<string, unknown> | undefined = {
  url: Deno.env.get("MONGO_URL") || (parsedToml?.mongo as any)?.url,
};
const unparsedRedisConfig: Record<string, unknown> | undefined = {
  cacheUrl: Deno.env.get("REDIS_CACHE_URL") ||
    (parsedToml.redis as any)?.cacheUrl,
};

const unparsedBotConfig: RecursivePartial<GlobalConfig> = {
  refreshCommands: parsedToml.refreshCommands as boolean | undefined,
  devMode: parsedToml.devMode as boolean | undefined,
  discord: unparsedDiscordConfig,
  mongo: unparsedMongoConfig,
  redis: unparsedRedisConfig,
};
export const botConfig = globalConfigSchema.parse(unparsedBotConfig);
export const discordConfig = botConfig.discord;
export const mongoConfig = botConfig.mongo;
export const redisConfig = botConfig.redis;

// function convertEnvVarToBoolean(envVarStringValue: string): boolean {
//   if (!envVarStringValue || envVarStringValue === "false") return false;
//   else if (envVarStringValue === "true") return true;
//   else {
//     throw new Error(
//       `This environment variable needs to have a boolean value`,
//     );
//   }
// }
