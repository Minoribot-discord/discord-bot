import {
  Interaction,
  InteractionCallbackData,
  InteractionResponseTypes,
} from "deps";
import { CustomBot } from "../client.ts";
import {
  getOrFetchGuild,
  getOrFetchMember,
  getOrFetchUser,
} from "utils/fetch.ts";

interface ContextParams {
  bot: CustomBot;
  interaction: Interaction;
}
class Context {
  bot: CustomBot;
  interaction: Interaction;
  authorId: bigint;
  guildId: bigint | undefined;

  constructor(params: ContextParams) {
    const { bot, interaction } = params;

    this.bot = bot;
    this.interaction = interaction;

    this.authorId = interaction.user.id;
    this.guildId = interaction.guildId;
  }

  reply(data: InteractionCallbackData) {
    this.bot.helpers.sendPrivateInteractionResponse(
      this.interaction.id,
      this.interaction.token,
      { type: InteractionResponseTypes.ChannelMessageWithSource, data },
    );
  }

  get author() {
    return getOrFetchUser(this.bot, this.interaction.user.id);
  }

  get authorMember() {
    if (!this.guildId) {
      throw new Error(
        "Cannot get the author of the interaction as a member, no guild id was found.",
      );
    }
    return getOrFetchMember(this.bot, this.guildId, this.authorId);
  }

  get guild() {
    if (!this.guildId) {
      throw new Error(
        "Cannot get the guild of the interaction, no guild id was found.",
      );
    }

    return getOrFetchGuild(this.bot, this.guildId);
  }
}

export { Context };
