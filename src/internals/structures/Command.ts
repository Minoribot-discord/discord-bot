import {
  ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  CreateApplicationCommand,
  PermissionStrings,
} from "deps";
import { Context, I18nContext, Inhibitor } from "structures";

enum CommandScope {
  GLOBAL,
  GUILD,
}

type CommandExecuteFunc = <T extends Context = Context>(
  ctx: T,
  i18n: I18nContext,
) => void | Promise<void>;

interface BaseCommandParams {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  inhibitors?: string[];
  execute?: CommandExecuteFunc;
}
class BaseCommand {
  name: string;
  description: string;
  options: ApplicationCommandOption[] = [];
  _inhibitors: string[] = [];
  inhibitors: Inhibitor[] = [];

  execute?: CommandExecuteFunc;

  constructor(params: BaseCommandParams) {
    const {
      name,
      description,
      options,
      inhibitors,
      execute,
    } = params;

    this.name = name;
    this.description = description;
    if (options) this.options = options;
    if (inhibitors) this._inhibitors = inhibitors;
    this.execute = execute?.bind(this);
  }
}

const defaultCategoryName = "misc";

interface CommandParams extends BaseCommandParams {
  /**
   * By default the category is "misc"
   */
  category?: string;
  scope: CommandScope;
  type?: ApplicationCommandTypes;
  guildIds?: bigint[];
  subCommands?: (SubCommand | SubCommandGroup)[];
  dmPermission?: boolean;
  defaultMemberPermissions?: PermissionStrings[];
}

class Command extends BaseCommand {
  /**
   * By default the category is "misc"
   */
  category = defaultCategoryName;
  type: ApplicationCommandTypes = ApplicationCommandTypes.ChatInput;
  scope: CommandScope;
  subCommands: (SubCommand | SubCommandGroup)[] = [];
  dmPermission = false;
  defaultMemberPermissions: PermissionStrings[] | undefined;

  guildIds: bigint[] = [];

  constructor(params: CommandParams) {
    super(params);

    const {
      scope,
      type,
      category,
      guildIds,
      subCommands,
      dmPermission,
      defaultMemberPermissions,
    } = params;
    this.scope = scope;
    if (type) this.type = type;
    if (category) this.category = category;
    if (guildIds) this.guildIds = guildIds;
    if (subCommands) this.subCommands = subCommands;
    if (dmPermission) this.dmPermission = dmPermission;
    if (defaultMemberPermissions) {
      this.defaultMemberPermissions = defaultMemberPermissions;
    }
  }

  get discordApplicationCommand(): CreateApplicationCommand {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      options: this.options,
      dmPermission: this.dmPermission,
      defaultMemberPermissions: this.defaultMemberPermissions,
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

interface SubCommandGroupParams extends SubCommandParams {
  subCommands: SubCommand[];
}
class SubCommandGroup extends SubCommand {
  type = ApplicationCommandOptionTypes.SubCommandGroup;
  subCommands: SubCommand[] = [];

  constructor(params: SubCommandGroupParams) {
    super(params);

    this.subCommands = params.subCommands;
  }
}

export { BaseCommand, Command, CommandScope, SubCommand, SubCommandGroup };
export type {
  CommandExecuteFunc,
  CommandParams,
  SubCommandGroupParams,
  SubCommandParams,
};
