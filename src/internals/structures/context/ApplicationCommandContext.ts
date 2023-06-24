import {
  Interaction,
  InteractionCallbackData,
  InteractionResponse,
  InteractionResponseTypes,
  Message,
} from "deps";
import {
  Context,
  customBot,
  getOrFetchGuild,
  getOrFetchMember,
  getOrFetchUser,
} from "internals";

class ApplicationCommandContext {
  interaction: Interaction;

  authorId: bigint;
  guildId: bigint | undefined;

  deferred = false;
  replied = false;

  constructor(interaction: Interaction) {
    this.interaction = interaction;

    this.authorId = interaction.user.id;
    this.guildId = interaction.guildId;
  }

  sendInteractionResponse(options: InteractionResponse) {
    return customBot.helpers.sendInteractionResponse(
      this.interaction.id,
      this.interaction.token,
      options,
    );
  }

  async defer() {
    await this.sendInteractionResponse({
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    });
    this.deferred = true;
  }

  async reply(
    data: string | InteractionCallbackData,
    wait = false,
  ): Promise<Message | undefined> {
    if (typeof data === "string") data = { content: data };

    let responseMessage: Message | undefined;
    if (this.replied) {
      responseMessage = await this.#replyFollowup(data);
    } else {
      responseMessage = await this.#replyOriginal(data);
      if (wait) {
        responseMessage = await customBot.helpers
          .getOriginalInteractionResponse(
            this.interaction.token,
          );
      }
    }

    return responseMessage;
  }

  get author() {
    return getOrFetchUser(customBot, this.interaction.user.id);
  }

  get authorMember() {
    if (!this.guildId) {
      throw new Error(
        "Cannot get the author of the interaction as a member, no guild id was found.",
      );
    }
    return getOrFetchMember(customBot, this.guildId, this.authorId);
  }

  get guild() {
    if (!this.guildId) {
      throw new Error(
        "Cannot get the guild of the interaction, no guild id was found.",
      );
    }

    return getOrFetchGuild(customBot, this.guildId);
  }

  async #replyOriginal(data: InteractionCallbackData) {
    let message: Message | undefined;

    if (!this.deferred) {
      await this.sendInteractionResponse(
        { type: InteractionResponseTypes.ChannelMessageWithSource, data },
      );
    } else {
      message = await customBot.helpers.editOriginalInteractionResponse(
        this.interaction.token,
        data,
      );
    }

    this.replied = true;

    return message;
  }

  #replyFollowup(data: InteractionCallbackData) {
    return customBot.helpers.sendFollowupMessage(
      this.interaction.token,
      // @ts-ignore: "type" property not needed
      {
        data,
      },
    );
  }
}

export { ApplicationCommandContext };
