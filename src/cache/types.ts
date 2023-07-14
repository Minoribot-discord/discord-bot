import { Json } from "zod_schemas/JSON.ts";

// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
// deno-lint-ignore no-empty-interface
export interface RedisJSONArray extends Array<RedisJSON> {}
export interface RedisJSONObject {
  [key: string]: RedisJSON;
  [key: number]: RedisJSON;
}
export type RedisJSON =
  | null
  | boolean
  | number
  | string
  | Date
  | RedisJSONArray
  | RedisJSONObject;

export interface Serializer<
  // deno-lint-ignore no-explicit-any
  TDeserialized extends any,
  TSerialized extends Json,
> {
  serialize?: (input: TDeserialized) => TSerialized;
  deserialize?: (input: TSerialized) => TDeserialized;
}
