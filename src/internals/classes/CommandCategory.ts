import { Collection } from "../../../deps.ts";
import { CustomBot } from "../client.ts";
import { Command } from "./Command.ts";

class CommandCategory {
  name = "";
  description = "";
  commands: Command[] = [];
  constructor(public bot: CustomBot) {}
}

export { CommandCategory };
