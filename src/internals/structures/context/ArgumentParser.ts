import { ApplicationCommandOptionTypes, InteractionDataOption } from "deps";

export class ArgumentParser {
  flattenedRawOptions: InteractionDataOption[] | undefined;

  constructor(public rawOptions: InteractionDataOption[] | undefined) {
    this.flattenedRawOptions = rawOptions;

    this.recursiveFlattenOptions(rawOptions);
  }

  recursiveFlattenOptions(options: InteractionDataOption[] | undefined) {
    if (!options || !options[0]) return;
    switch (options[0].type) {
      case ApplicationCommandOptionTypes.SubCommandGroup:
        if (options[0].options) {
          this.flattenedRawOptions?.push(...options[0].options);
          this.recursiveFlattenOptions(options[0].options);
        }
        break;
      case ApplicationCommandOptionTypes.SubCommand:
        if (options[0].options) {
          this.flattenedRawOptions?.push(...options[0].options);
        }
        break;
    }
  }

  getString(argName: string): string | undefined {
    return this.flattenedRawOptions?.find((arg) =>
      (arg.name === argName) && (typeof arg.value === "string")
    )?.value as string | undefined;
  }

  getNumber(argName: string): number | undefined {
    return this.flattenedRawOptions?.find((arg) =>
      (arg.name === argName) && (typeof arg.value === "number")
    )?.value as number | undefined;
  }

  getBoolean(argName: string): boolean | undefined {
    return this.flattenedRawOptions?.find((arg) =>
      (arg.name === argName) && (typeof arg.value === "boolean")
    )?.value as boolean | undefined;
  }
}
