import { ApplicationCommandTypes, CreateApplicationCommand } from "deps";
import { CustomBot } from "../client.ts";

class Command {
  name = "";
  description = "";
  category = "";
  type: ApplicationCommandTypes = ApplicationCommandTypes.ChatInput;
  constructor(public bot: CustomBot) {}

  execute(context: any) {}

  get createApplicationCommand(): CreateApplicationCommand {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
    };
  }
}

export { Command };
