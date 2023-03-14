import { dotenv } from "deps";

interface BotConfig {
  discordToken: string;
}

const env = await dotenv.load();

const botConfig: BotConfig = {
  discordToken: env.DISCORD_TOKEN,
};

export { botConfig };
export type { BotConfig };
