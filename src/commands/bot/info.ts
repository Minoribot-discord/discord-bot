import { Command, CommandScope, SubCommand, SubCommandGroup } from "classes";

export default class InfoCommand extends Command {
  constructor() {
    super({
      name: "info",
      description: "Mostra informacions sobre el bot.",
      scope: CommandScope.SUPPORT,
      subCommands: [new TestSubCommandGroup()],
    });
  }
}

class TestSubCommandGroup extends SubCommandGroup {
  constructor() {
    super({
      name: "testgroup",
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
