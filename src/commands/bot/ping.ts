import { Command, CommandScope } from "internals/classes/Command.ts";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "pong",
      scope: CommandScope.SUPPORT,
    });
  }
}
