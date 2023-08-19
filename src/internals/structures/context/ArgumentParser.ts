import { InteractionDataOption } from "deps";

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
}
