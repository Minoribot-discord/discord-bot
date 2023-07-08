import { User } from "deps";

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
