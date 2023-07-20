// deno-lint-ignore-file require-await
import {
  bigintToSnowflake,
  BigString,
  Channel,
  Collection,
  createClient,
  DiscordChannel,
  DiscordGuild,
  DiscordMember,
  DiscordMessage,
  DiscordUser,
  Guild,
  logger,
  Member,
  Message,
  snowflakeToBigint,
  User,
} from "deps";
import { botConfig, redisConfig } from "config";
import { Serializer } from "./types.ts";

// Todo: Finish serializers and maybe implement Redis as main cache
export const redisCacheClient = createClient({ url: redisConfig.cacheUrl });
// export async function initRedisCacheClient() {
//   logger.info("Connecting to the Redis cache database");
//   await redisCacheClient.connect();
//   logger.info("Redis cache client connected");
// }

function createCache<
  // deno-lint-ignore no-explicit-any
  TDeserialized extends Record<string, any>,
  // deno-lint-ignore no-explicit-any
  TSerialized extends Record<string, any>,
>(
  options: {
    namespace: string;
    serializer?: Serializer<TDeserialized, TSerialized>;
    filter?: (
      value: TDeserialized,
      cachedAt: Collection<bigint, number>,
    ) => boolean;
    interval?: number;
  },
) {
  const { namespace, filter, interval } = options;
  const collection = new Collection<string, TDeserialized>();
  const cachedAt = new Collection<bigint, number>();

  collection.startSweeper({
    filter: filter
      ? ((value) => {
        logger.info(`Cleaned cache ${namespace}`);
        return filter(value, cachedAt);
      })
      : (() => true),
    interval: interval ?? 5 * 1000 * 60,
  });
  function resetCachedAt(key: bigint) {
    cachedAt.set(key, Date.now());
  }

  return {
    async set(key: BigString, value: TDeserialized): Promise<void> {
      resetCachedAt(BigInt(key));
      if (typeof key === "bigint") key = bigintToSnowflake(key);

      return void collection.set(key, value);

      /*
      For now i'll cache in ram, but later on I might cache in Redis
      So I'll let this commented code
      */
      // const ok = await redisCacheClient.json.set(
      //   `${namespace}:${key}`,
      //   "$",
      //   serializer?.serialize
      //     ? jsonSchema.parse(
      //       removeUndefinedValuesFromObject(serializer.serialize(value)),
      //     )
      //     : (removeUndefinedValuesFromObject(value) as unknown) as TSerialized,
      // );

      // if (ok !== "OK") {
      //   throw new Error(
      //     "Couldn't set the value correctly, Redis server didn't return 'OK'",
      //   );
      // }
    },
    async get(key: BigString): Promise<TDeserialized | null> {
      resetCachedAt(BigInt(key));
      if (typeof key === "bigint") key = bigintToSnowflake(key);

      return collection.get(key) ?? null;

      /*
      For now i'll cache in ram, but later on I might cache in Redis
      So I'll let this commented code
      */
      // const value = (await redisCacheClient.json.get(
      //   `${namespace}:${key}`,
      // )) as TSerialized | null;
      // if (!value) return null;

      // return serializer?.deserialize
      //   ? serializer.deserialize(
      //     (jsonSchema.parse(value) as unknown) as TSerialized,
      //   )
      //   : (value as unknown) as TDeserialized;
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

      return void collection.delete(key);
      //  await redisCacheClient.json.del(`${namespace}:${key}`);
    },
  };
}

export type RedisCache = ReturnType<typeof createCache>;

export const customCache = {
  existingGuilds: new Set<bigint>(),
  // unavailableGuilds: new Set<bigint>(),
  users: createCache<User, DiscordUser>({
    namespace: "users",
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
  members: createCache<Member, DiscordMember>({
    namespace: "members",
    filter: (member, cachedAt) => {
      const resolvedId = snowflakeToBigint(`${member.guildId}${member.id}`);
      return (member.user ? !member.user.bot : true) &&
        (cachedAt.has(resolvedId)
          ? (Date.now() - cachedAt.get(resolvedId)! > 30 * 1000 * 60)
          : true);
    },
    interval: 10 * 1000 * 60,
  }),
  guilds: createCache<Guild, DiscordGuild>({
    namespace: "guilds",
    filter: (guild, cachedAt) => {
      return (guild.id !== botConfig.supportGuildId) &&
        (cachedAt.has(guild.id)
          ? (Date.now() - cachedAt.get(guild.id)! > 60 * 1000 * 60)
          : true);
    },
    interval: 15 * 1000 * 60,
  }),
  channels: createCache<Channel, DiscordChannel>({
    namespace: "channels",
    filter: (channel, cachedAt) => {
      return (cachedAt.has(channel.id)
        ? (Date.now() - cachedAt.get(channel.id)! > 15 * 1000 * 60)
        : true);
    },
  }),
  messages: createCache<Message, DiscordMessage>({
    namespace: "messages",
  }),
};
