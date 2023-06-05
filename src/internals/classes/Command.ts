import { ApplicationCommandTypes, CreateApplicationCommand } from "deps";
import { CustomBot } from "../client.ts";
import { Context } from "./Context.ts";

enum CommandScope {
  GLOBAL,
  GUILD,
  SUPPORT,
}
class Command {
  filePath = "";
  name = "";
  description = "";
  category = "";
  type: ApplicationCommandTypes = ApplicationCommandTypes.ChatInput;
  scope: CommandScope = CommandScope.SUPPORT;
  guildIds: bigint[] = [];

  constructor(public bot: CustomBot) {}

  // deno-lint-ignore no-unused-vars
  execute(context: Context) {
    throw new Error("Function not implemented");
  }

  get APIApplicationCommand(): CreateApplicationCommand {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
    };
  }
}

export { Command, CommandScope };
