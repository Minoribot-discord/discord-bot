import { camelToSnakeCase, GatewayIntents, lodash, User } from "deps";

const devModePrefix = "DEV_";

export function databaseAddDevModePrefix(devMode: boolean, name: string) {
  return devMode ? `${devModePrefix}${name}` : name;
}

export function userUsernameAndDiscriminator(user: User) {
  if (user.discriminator && user.discriminator !== "0") {
    return `${user.username}#${user.discriminator}`;
  } else {
    return user.username;
  }
}

export function camelToScreamingSnakeCase(str: string) {
  return camelToSnakeCase(str).toUpperCase();
}

export function isNumberNegative(number: number) {
  return number < 0;
}

export type WalkObjectEntryType =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "array"
  | "string"
  | "symbol"
  | "undefined";

export interface WalkObjectEntry {
  key: string;
  path: string;
  type: WalkObjectEntryType;
  value: unknown;
}

export const walkObjectMaxPathLength = 500;
export function* walkObject(
  obj: object,
  maxDepth = 50,
  depth = 0,
  path?: string,
): Generator<
  WalkObjectEntry,
  void,
  unknown
> {
  const entries = Object.entries(obj);

  for (const [key, value] of entries) {
    yield {
      key,
      path: `${path ? `${path}.` : ""}${key}`,
      type: Array.isArray(value) ? "array" : typeof value,
      value,
    };

    if (value && typeof value === "object" && depth < maxDepth) {
      yield* walkObject(
        // deno-lint-ignore no-explicit-any
        value as any,
        maxDepth,
        ++depth,
        `${path ? `${path}.` : ""}${key}`,
      );
    }
  }
}

/**
 * This function checks for every key of the object,
 * and will remove any key of which the value equals undefined
 */
export function removeUndefinedValuesFromObject<
  T,
>(obj: T) {
  if (!obj || typeof obj !== "object") return obj;

  const propertiesOrPathsToOmit: string[] = [];

  for (const entry of walkObject(obj)) {
    if (entry.value === undefined) {
      propertiesOrPathsToOmit.push(entry.path);
    }
  }

  return lodash.omit(obj, propertiesOrPathsToOmit);
}

function verifyGatewayIntentKeys(
  gatewayIntentKeys: unknown[],
): asserts gatewayIntentKeys is (keyof typeof GatewayIntents)[] {
  for (const key of gatewayIntentKeys) {
    if (
      typeof key !== "string" || !Object.keys(GatewayIntents).includes(key)
    ) {
      throw new Error(`Incorrect intent key: ${key}`);
    }
  }
}
export function transformGatewayIntentKeysToBitfield(
  gatewayIntentKeys: unknown[],
): GatewayIntents {
  verifyGatewayIntentKeys(gatewayIntentKeys);

  let intents = 0;
  gatewayIntentKeys
    .map((intent) => intents |= GatewayIntents[intent]);

  return intents;
}
