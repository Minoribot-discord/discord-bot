import {
  DiscordChannel,
  DiscordMember,
  DiscordRole,
  InteractionDataOption,
} from "deps";

export class ArgumentParser {
  constructor(public raw: InteractionDataOption[] | undefined) {}

  getString(argName: string): string | undefined {
    return this.raw?.find((arg) =>
      (arg.name === argName) && (typeof arg.value === "string")
    )?.value as string | undefined;
  }

  getNumber(argName: string): number | undefined {
    return this.raw?.find((arg) =>
      (arg.name === argName) && (typeof arg.value === "number")
    )?.value as number | undefined;
  }

  getBoolean(argName: string): boolean | undefined {
    return this.raw?.find((arg) =>
      (arg.name === argName) && (typeof arg.value === "boolean")
    )?.value as boolean | undefined;
  }

  getMember(argName: string): DiscordMember | undefined {
    return this.raw?.find((arg) =>
      (arg.name === argName) &&
      ((typeof arg.value === "object") && ("roles" in arg.value))
    )?.value as DiscordMember | undefined;
  }

  getChannel(argName: string): DiscordChannel | undefined {
    return this.raw?.find((arg) =>
      (arg.name === argName) &&
      ((typeof arg.value === "object") && ("type" in arg.value))
    )?.value as DiscordChannel | undefined;
  }

  getRole(argName: string): DiscordRole | undefined {
    return this.raw?.find((arg) =>
      (arg.name === argName) &&
      ((typeof arg.value === "object") && ("color" in arg.value))
    )?.value as DiscordRole | undefined;
  }
}
