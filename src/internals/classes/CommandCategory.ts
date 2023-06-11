import { CustomBot } from "../client.ts";
import { Command } from "./Command.ts";

interface CommandCategoryParams {
  name: string;
  description?: string;
}
class CommandCategory {
  name: string;
  description = "";
  commands: Command[] = [];

  constructor(public bot: CustomBot, params: CommandCategoryParams) {
    this.name = params.name;

    if (params.description) this.description = params.description;
  }
}

export { CommandCategory };
