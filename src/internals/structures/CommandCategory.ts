import { Command, CustomBot } from "internals";

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
