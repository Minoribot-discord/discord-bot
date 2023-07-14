import { lodash, User } from "deps";

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

export function camelCaseToSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, "_$1");
}

export function camelCaseToScreamingSnakeCase(str: string) {
  return camelCaseToSnakeCase(str).toUpperCase();
}

export function isNumberNegative(number: number) {
  return number < 0;
}

// I did that for something else, then I changed my mind
// But I thought "why not keep these things here?"
// Might be useful some day, who knows?
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
  T extends object,
>(obj: T) {
  const propertiesOrPathsToOmit: string[] = [];

  for (const entry of walkObject(obj)) {
    if (entry.value === undefined) {
      propertiesOrPathsToOmit.push(entry.path);
    }
  }

  return lodash.omit(obj, propertiesOrPathsToOmit);
}
