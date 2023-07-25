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
