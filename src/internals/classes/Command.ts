import {
  ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  CreateApplicationCommand,
} from "deps";
import { Context } from "./Context.ts";
import { Inhibitor } from "./classes.ts";

enum CommandScope {
  GLOBAL,
  GUILD,
  SUPPORT,
}

type CommandExecuteFunc = (context: Context) => void | Promise<void>;

interface BaseCommandParams {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  inhibitorStrings?: string[];
  execute?: CommandExecuteFunc;
}
class BaseCommand {
  name: string;
  description: string;
  options: ApplicationCommandOption[] = [];
  inhibitorStrings: string[] = [];
  inhibitors: Inhibitor[] = [];

  execute: CommandExecuteFunc;

  constructor(params: BaseCommandParams) {
    const {
      name,
      description,
      options,
      inhibitorStrings,
      execute,
    } = params;

    this.name = name;
    this.description = description;
    if (options) this.options = options;
    if (inhibitorStrings) this.inhibitorStrings = inhibitorStrings;
    this.execute = execute?.bind(this) || ((_context: Context) => {
      throw new Error("Function not implemented.");
    });
  }
}

interface CommandParams extends BaseCommandParams {
  scope: CommandScope;
  type?: ApplicationCommandTypes;
  guildIds?: bigint[];
  subCommands?: (SubCommand | SubCommandGroup)[];
}

class Command extends BaseCommand {
  filePath = "";
  category = "";
  type: ApplicationCommandTypes = ApplicationCommandTypes.ChatInput;
  scope: CommandScope = CommandScope.SUPPORT;
  subCommands: (SubCommand | SubCommandGroup)[] = [];

  guildIds: bigint[] = [];

  constructor(params: CommandParams) {
    super(params);

    const { scope, type, guildIds, subCommands } = params;
    this.scope = scope;
    if (type) this.type = type;
    if (guildIds) this.guildIds = guildIds;
    if (subCommands) this.subCommands = subCommands;

    convertSubCommandsIntoOptions(this, this.subCommands);
  }

  get discordApplicationCommand(): CreateApplicationCommand {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      options: this.options,
    };
  }
}

function convertSubCommandsIntoOptions(
  parent: Command | SubCommandGroup,
  subCommands: (SubCommand | SubCommandGroup)[],
) {
  parent.options = [
    ...parent.options,
    ...subCommands.map((subCommand) => {
      subCommand.parent = parent;

      return subCommand.discordOption;
    }),
  ];
}

interface SubCommandGroupParams extends BaseCommandParams {
  subCommands: SubCommand[];
}
class SubCommandGroup extends BaseCommand {
  parent!: Command;
  type = ApplicationCommandOptionTypes.SubCommandGroup;
  subCommands: SubCommand[] = [];

  constructor(params: SubCommandGroupParams) {
    super(params);

    this.subCommands = params.subCommands;

    convertSubCommandsIntoOptions(this, this.subCommands);
  }

  get discordOption(): ApplicationCommandOption {
    return {
      type: this.type,
      description: this.description,
      name: this.name,
      options: this.options,
    };
  }
}

// deno-lint-ignore no-empty-interface
interface SubCommandParams extends BaseCommandParams {}

class SubCommand extends BaseCommand {
  parent!: Command | SubCommandGroup;
  type = ApplicationCommandOptionTypes.SubCommand;

  constructor(params: SubCommandParams) {
    super(params);
  }

  get discordOption(): ApplicationCommandOption {
    return {
      type: this.type,
      description: this.description,
      name: this.name,
      options: this.options,
    };
  }
}

export { BaseCommand, Command, CommandScope, SubCommand, SubCommandGroup };
export type { CommandExecuteFunc };
