import { dotenv, GatewayIntents } from "deps";

export interface BotConfig {
  discordToken: string;
  ownerId: bigint;
  supportGuildId: bigint;
  intents: GatewayIntents;
  refreshCommands: boolean;
  devMode: boolean;
  mongo: MongoConfig;
  redis: RedisConfig;
}

export interface MongoConfig {
  url: string;
}

export interface RedisConfig {
  cacheUrl: string;
}

// @ts-ignore:
let intents: BotConfig["intents"] = 0;
([
  "Guilds",
  "GuildMembers",
  "GuildPresences",
  "GuildMessages",
  "DirectMessages",
  "MessageContent",
] as Array<keyof typeof GatewayIntents>) //
  .map((intent) => intents |= GatewayIntents[intent]);

type EnvKey =
  | "DISCORD_TOKEN"
  | "BOT_OWNER_ID"
  | "SUPPORT_GUILD_ID"
  | "REFRESH_COMMANDS"
  | "DEV_MODE"
  | "MONGO_URL"
  | "REDIS_CACHE_URL";

type EnvKeys = {
  [key in EnvKey]: string;
};
const env = await dotenv.load() as EnvKeys;

function convertEnvVarToBoolean(envVarName: EnvKey): boolean {
  const envVar = env[envVarName];
  if (!envVar || envVar === "false") return false;
  else if (envVar === "true") return true;
  else {
    throw new Error(
      `${envVarName} environment variable needs to be a boolean value`,
    );
  }
}

export const mongoConfig: MongoConfig = {
  url: env["MONGO_URL"]!,
};

export const redisConfig: RedisConfig = {
  cacheUrl: env["REDIS_CACHE_URL"]!,
};

export const botConfig: BotConfig = {
  discordToken: env["DISCORD_TOKEN"]!,
  ownerId: BigInt(env["BOT_OWNER_ID"]!),
  supportGuildId: BigInt(env["SUPPORT_GUILD_ID"]!),
  intents,
  refreshCommands: convertEnvVarToBoolean("REFRESH_COMMANDS"),
  devMode: convertEnvVarToBoolean("DEV_MODE"),
  mongo: mongoConfig,
  redis: redisConfig,
};
