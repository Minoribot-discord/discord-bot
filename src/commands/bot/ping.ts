import { Command, CommandScope } from "classes";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "pong",
      scope: CommandScope.SUPPORT,
    });
  }
}
