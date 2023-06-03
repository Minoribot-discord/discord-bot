import { Command } from "internals/classes/Command.ts";
import { CustomBot } from "internals/client.ts";

export default class PingCommand extends Command {
  name = "ping";
  description = "pong";
  constructor(bot: CustomBot) {
    super(bot);
  }
}
