import {
  Interaction,
  InteractionCallbackData,
  InteractionResponse,
  InteractionResponseTypes,
  Message,
} from "deps";
import { CustomBot } from "internals";
import { getOrFetchGuild, getOrFetchMember, getOrFetchUser } from "utils";
import { ArgumentParser } from "structures";

class ApplicationCommandContext {
  authorId: bigint;
  guildId: bigint | undefined;

  args: ArgumentParser;

  deferred = false;
  replied = false;

  constructor(public bot: CustomBot, public interaction: Interaction) {
    this.authorId = interaction.user.id;
    this.guildId = interaction.guildId;

    this.args = new ArgumentParser(interaction.data?.options);
  }

  sendInteractionResponse(options: InteractionResponse) {
    return this.bot.helpers.sendInteractionResponse(
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
        responseMessage = await this.bot.helpers
          .getOriginalInteractionResponse(
            this.interaction.token,
          );
      }
    }

    return responseMessage;
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

  async #replyOriginal(data: InteractionCallbackData) {
    let message: Message | undefined;

    if (!this.deferred) {
      await this.sendInteractionResponse(
        { type: InteractionResponseTypes.ChannelMessageWithSource, data },
      );
    } else {
      message = await this.bot.helpers.editOriginalInteractionResponse(
        this.interaction.token,
        data,
      );
    }

    this.replied = true;

    return message;
  }

  #replyFollowup(data: InteractionCallbackData) {
    return this.bot.helpers.sendFollowupMessage(
      this.interaction.token,
      // @ts-ignore: "type" property not needed
      {
        data,
      },
    );
  }
}

export { ApplicationCommandContext };
