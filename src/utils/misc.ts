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

export function isNumberNegative(number: number) {
  return number < 0;
}
