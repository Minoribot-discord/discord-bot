import { Command, CommandScope } from "internals/classes/Command.ts";
import { CustomBot } from "internals/client.ts";

export default class InfoCommand extends Command {
  name = "info";
  description = "Display some info about the bot";
  scope = CommandScope.SUPPORT;

  constructor(bot: CustomBot) {
    super(bot);
  }
}
