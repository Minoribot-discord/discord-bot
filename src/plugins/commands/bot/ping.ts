import { Command, CommandScope } from "structures";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "pong",
      scope: CommandScope.SUPPORT,
      dmPermission: true,
    });
  }
}
