import {
  Command,
  CommandScope,
  SubCommand,
  SubCommandGroup,
} from "internals/classes/Command.ts";

export default class InfoCommand extends Command {
  constructor() {
    super({
      name: "info",
      description: "Display some info about the bot",
      scope: CommandScope.SUPPORT,
      subCommands: [new TestSubCommandGroup()],
    });
  }
}

class TestSubCommandGroup extends SubCommandGroup {
  constructor() {
    super({
      name: "test",
      description: "test",
      subCommands: [new TestSubCommand()],
    });
  }
}

class TestSubCommand extends SubCommand {
  constructor() {
    super({ name: "testsubcmd", description: "test" });
  }
}
