import {
  Interaction,
  InteractionCallbackData,
  InteractionResponse,
  InteractionResponseTypes,
} from "deps";
import { CustomBot } from "../client.ts";

class Context {
  constructor(public bot: CustomBot, public interaction: Interaction) {}

  reply(data: InteractionCallbackData) {
    this.bot.helpers.sendPrivateInteractionResponse(
      this.interaction.id,
      this.interaction.token,
      { type: InteractionResponseTypes.ChannelMessageWithSource, data },
    );
  }
}

export { Context };
