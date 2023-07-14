// deno-lint-ignore-file no-explicit-any
// import { connect } from "deps";

// const client = await connect({
// hostname: ""
// })
// npm redis
import { bigintToSnowflake, BigString, createClient } from "deps";
import { redisConfig } from "config";
import { Serializer } from "./types.ts";
import { Json } from "zod_schemas";

export const redisCacheClient = createClient({ url: redisConfig.cacheUrl });

await redisCacheClient.connect();

function createCache<
  TDeserialized extends Record<string, any>,
  TSerialized extends Json,
>(
  namespace: string,
  serializer?: Serializer<TDeserialized, TSerialized>,
) {
  return {
    async set(key: BigString, value: TDeserialized) {
      if (typeof key === "bigint") key = bigintToSnowflake(key);

      const ok = await redisCacheClient.json.set(
        `${namespace}:${key}`,
        "$",
        serializer?.serialize
          ? serializer.serialize(value)
          : (value as unknown) as TSerialized,
      );

      if (ok !== "OK") {
        throw new Error(
          "Couldn't set the value correctly, Redis server didn't return 'OK'",
        );
      }
    },
    async get(key: BigString): Promise<TDeserialized> {
      if (typeof key === "bigint") key = bigintToSnowflake(key);

      const value = (await redisCacheClient.json.get(
        `${namespace}:${key}`,
      )) as TSerialized;

      return serializer?.deserialize
        ? serializer.deserialize(value)
        : (value as unknown) as TDeserialized;
    },
  };
}

export type RedisCache = ReturnType<typeof createCache>;

const redisCache = {
  //  users: createCache("users"),
  //  members: createCache<Member>("members", {
  //    set: (obj) => ({ ...obj, cachedAt: Date.now() }),
  //  }),
};

const set = await redisCacheClient.json.set("s", "$", { uwu: "owo" });

const get = await redisCacheClient.json.get("s");
console.log(get);
await redisCacheClient.json.del("s");
