import { dotenv, GatewayIntents } from "deps";

interface BotConfig {
  discordToken: string;
  supportGuildId: bigint;
  intents: GatewayIntents;
  refreshCommands: boolean;
  devMode: boolean;
  mongo: MongoConfig;
}

interface MongoConfig {
  url: string;
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

const env = await dotenv.load();

function convertEnvVarToBoolean(envVarName: string): boolean {
  const envVar = env[envVarName];
  if (!envVar || envVar === "false") return false;
  else if (envVar === "true") return true;
  else {
    throw new Error(
      `${envVarName} environment variable needs to be a boolean value`,
    );
  }
}

const mongoConfig: MongoConfig = {
  url: env["MONGO_URL"],
};

const botConfig: BotConfig = {
  discordToken: env["DISCORD_TOKEN"],
  supportGuildId: BigInt(env["SUPPORT_GUILD_ID"]),
  intents,
  refreshCommands: convertEnvVarToBoolean("REFRESH_COMMANDS"),
  devMode: convertEnvVarToBoolean("DEV_MODE"),
  mongo: mongoConfig,
};

export { botConfig };
export type { BotConfig };
