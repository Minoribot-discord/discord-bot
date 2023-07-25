// deno-lint-ignore-file require-await
import {
  bigintToSnowflake,
  BigString,
  Channel,
  Collection,
  createClient,
  Guild,
  logger,
  Member,
  Message,
  snowflakeToBigint,
  User,
} from "deps";
import { discordConfig, redisConfig } from "config";

// Todo: Implement Redis cache (using an encoder & a decoder)
export const redisCacheClient = createClient({ url: redisConfig?.cacheUrl });
// export async function initRedisCacheClient() {
//   logger.info("Connecting to the Redis cache database");
//   await redisCacheClient.connect();
//   logger.info("Redis cache client connected");
// }

function createCache<
  // deno-lint-ignore no-explicit-any
  TData extends Record<string, any>,
>(
  options: {
    cacheName: string;
    filter?: (
      value: TData,
      cachedAt: Collection<bigint, number>,
    ) => boolean;
    interval?: number;
  },
) {
  const { cacheName, filter, interval } = options;
  const collection = new Collection<string, TData>();
  const cachedAt = new Collection<bigint, number>();

  collection.startSweeper({
    filter: filter
      ? ((value) => {
        logger.info(`Cleaned cache ${cacheName}`);
        return filter(value, cachedAt);
      })
      : (() => true),
    interval: interval ?? 5 * 1000 * 60,
  });
  function resetCachedAt(key: bigint) {
    cachedAt.set(key, Date.now());
  }

  return {
    async set(key: BigString, value: TData): Promise<void> {
      resetCachedAt(BigInt(key));
      if (typeof key === "bigint") key = bigintToSnowflake(key);

      collection.set(key, value);
    },
    async get(key: BigString): Promise<TData | null> {
      resetCachedAt(BigInt(key));
      if (typeof key === "bigint") key = bigintToSnowflake(key);

      return collection.get(key) ?? null;
    },

    async size(): Promise<number> {
      return collection.size;
    },

    async has(key: BigString): Promise<boolean> {
      resetCachedAt(snowflakeToBigint(key));
      if (typeof key === "bigint") key = bigintToSnowflake(key);

      return collection.has(key);
      // return !!this.get(key);
    },

    async delete(key: BigString): Promise<void> {
      cachedAt.delete(snowflakeToBigint(key));
      if (typeof key === "bigint") key = bigintToSnowflake(key);

      collection.delete(key);
    },
  };
}

export type RedisCache = ReturnType<typeof createCache>;

export const customCache = {
  existingGuilds: new Set<bigint>(),
  // unavailableGuilds: new Set<bigint>(),
  users: createCache<User>({
    cacheName: "users",
    filter: (user, cachedAt) => {
      return !user.bot &&
        (cachedAt.has(user.id)
          ? (Date.now() - cachedAt.get(user.id)! > 15 * 1000 * 60)
          : true);
    },
  }),
  /**
   * Key needs to follow this format: `${guildId}${memberId}`
   */
  members: createCache<Member>({
    cacheName: "members",
    filter: (member, cachedAt) => {
      const resolvedId = snowflakeToBigint(`${member.guildId}${member.id}`);
      return (member.user ? !member.user.bot : true) &&
        (cachedAt.has(resolvedId)
          ? (Date.now() - cachedAt.get(resolvedId)! > 30 * 1000 * 60)
          : true);
    },
    interval: 10 * 1000 * 60,
  }),
  guilds: createCache<Guild>({
    cacheName: "guilds",
    filter: (guild, cachedAt) => {
      return (guild.id !== discordConfig.supportGuildId) &&
        (cachedAt.has(guild.id)
          ? (Date.now() - cachedAt.get(guild.id)! > 60 * 1000 * 60)
          : true);
    },
    interval: 15 * 1000 * 60,
  }),
  channels: createCache<Channel>({
    cacheName: "channels",
    filter: (channel, cachedAt) => {
      return (cachedAt.has(channel.id)
        ? (Date.now() - cachedAt.get(channel.id)! > 15 * 1000 * 60)
        : true);
    },
  }),
  messages: createCache<Message>({
    cacheName: "messages",
  }),
};
