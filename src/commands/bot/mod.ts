import { CommandCategory } from "internals/classes/CommandCategory.ts";
import { CustomBot } from "internals/client.ts";

export default class BotCategory extends CommandCategory {
  name = "bot";
  description = "";

  constructor(bot: CustomBot) {
    super(bot);
  }
}
