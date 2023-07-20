import {
  ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  CreateApplicationCommand,
  PermissionStrings,
} from "deps";
import { Context, I18nContext, Inhibitor } from "structures";

export enum CommandScope {
  GLOBAL,
  GUILD,
}

export type CommandExecuteFunc = (
  ctx: Context,
  i18n: I18nContext,
) => void | Promise<void>;

export interface BaseCommandParams {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  inhibitors?: string[];
  requiredBotPermissions?: PermissionStrings[];
  execute?: CommandExecuteFunc;
}

export const globalRequiredBotPermissions: PermissionStrings[] = [
  "EMBED_LINKS",
];

export class BaseCommand {
  name: string;
  description: string;
  options: ApplicationCommandOption[] = [];
  _inhibitors: string[] = [];
  inhibitors: Inhibitor[] = [];
  requiredBotPermissions: PermissionStrings[] = [];

  execute?: CommandExecuteFunc;

  constructor(params: BaseCommandParams) {
    const {
      name,
      description,
      options,
      inhibitors,
      requiredBotPermissions,
      execute,
    } = params;

    this.name = name;
    this.description = description;
    if (options) this.options = options;
    if (inhibitors) this._inhibitors = inhibitors;
    if (requiredBotPermissions) {
      this.requiredBotPermissions = requiredBotPermissions;

      if (requiredBotPermissions.length > 0) {
        for (
          const globalRequiredBotPermission of globalRequiredBotPermissions
        ) {
          if (
            !this.requiredBotPermissions.includes(globalRequiredBotPermission)
          ) {
            this.requiredBotPermissions.push(globalRequiredBotPermission);
          }
        }
      }
    }

    this.execute = execute?.bind(this);
  }
}

export const defaultCategoryName = "misc";

export interface CommandParams extends BaseCommandParams {
  /**
   * By default the category is "misc"
   */
  category?: string;
  scope: CommandScope;
  type?: ApplicationCommandTypes;
  guildIds?: bigint[];
  dmPermission?: boolean;
  defaultMemberPermissions?: PermissionStrings[];
}

export class Command extends BaseCommand {
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
      dmPermission,
      defaultMemberPermissions,
    } = params;
    this.scope = scope;
    if (type) this.type = type;
    if (category) this.category = category;
    if (guildIds) this.guildIds = guildIds;
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
export interface SubCommandParams extends BaseCommandParams {}
export class SubCommand extends BaseCommand {
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

// deno-lint-ignore no-empty-interface
export interface SubCommandGroupParams extends SubCommandParams {}
export class SubCommandGroup extends SubCommand {
  type = ApplicationCommandOptionTypes.SubCommandGroup;
  subCommands: SubCommand[] = [];

  constructor(params: SubCommandGroupParams) {
    super(params);
  }
}
