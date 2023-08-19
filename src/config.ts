// deno-lint-ignore-file no-explicit-any
import { dotenv, snowflakeToBigint, toml } from "deps";
import { RecursivePartial } from "structures";
import {
  GlobalConfig,
  globalConfigSchema,
  WebhookIdAndToken,
} from "zod_schemas";
import { transformGatewayIntentKeysToBitfield } from "./utils/misc.ts";

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

const rawToml = await Deno.readTextFile("./config.toml");
const parsedToml = toml.parse(rawToml);

const unparsedDiscordConfig: Record<string, unknown> = {
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
const unparsedOpenWeatherConfig: Record<string, unknown> = {
  apiKey: Deno.env.get("OPENWEATHER_API_KEY") ||
    (parsedToml?.openWeather as any)?.apiKey,
  apiUrl: (parsedToml?.openWeather as any)?.apiUrl,
  defaultUnits: (parsedToml?.openWeather as any)?.defaultUnits,
};
const unparsedMongoConfig: Record<string, unknown> = {
  url: Deno.env.get("MONGO_URL") || (parsedToml?.mongo as any)?.url,
};
const unparsedRedisConfig: Record<string, unknown> = {
  cacheUrl: Deno.env.get("REDIS_CACHE_URL") ||
    (parsedToml.redis as any)?.cacheUrl,
};
const unparsedWebhooks:
  | Record<string, RecursivePartial<WebhookIdAndToken>>
  | undefined = {};
if ("webhooks" in parsedToml && typeof parsedToml.webhooks === "object") {
  for (const [key, value] of Object.entries(parsedToml.webhooks as object)) {
    if (typeof value === "object") {
      unparsedWebhooks[key] = {
        id: typeof value.id === "string"
          ? snowflakeToBigint(value.id)
          : undefined,
        token: value.token,
      };
    }
  }
}

const unparsedBotConfig: RecursivePartial<GlobalConfig> = {
  refreshCommands: parsedToml.refreshCommands as boolean | undefined,
  devMode: parsedToml.devMode as boolean | undefined,
  discord: unparsedDiscordConfig,
  openWeather: unparsedOpenWeatherConfig,
  mongo: unparsedMongoConfig,
  redis: unparsedRedisConfig,
  webhooks: unparsedWebhooks,
};

export const botConfig = globalConfigSchema.parse(unparsedBotConfig);
export const discordConfig = botConfig.discord;
export const openWeatherConfig = botConfig.openWeather;
export const mongoConfig = botConfig.mongo;
export const redisConfig = botConfig.redis;
export const webhooks = botConfig.webhooks;

// function convertEnvVarToBoolean(envVarStringValue: string): boolean {
//   if (!envVarStringValue || envVarStringValue === "false") return false;
//   else if (envVarStringValue === "true") return true;
//   else {
//     throw new Error(
//       `This environment variable needs to have a boolean value`,
//     );
//   }
// }
