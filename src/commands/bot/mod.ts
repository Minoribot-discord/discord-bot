import { CommandCategory } from "classes";
import { CustomBot } from "internals/CustomBotType.ts";

export default class BotCategory extends CommandCategory {
  constructor(bot: CustomBot) {
    super(bot, { name: "bot" });
  }
}
