import {
  Embed,
  Interaction,
  InteractionCallbackData,
  InteractionResponse,
  InteractionResponseTypes,
  Message,
} from "deps";
import { CustomBot, EmbedBuilder } from "internals";
import {
  getOrFetchChannel,
  getOrFetchGuild,
  getOrFetchMember,
  getOrFetchUser,
} from "utils";
import { ArgumentParser } from "structures";

class ApplicationCommandContext {
  authorId: bigint;
  guildId: bigint | undefined;
  channelId: bigint | undefined;

  args: ArgumentParser;

  deferred = false;
  replied = false;

  constructor(public bot: CustomBot, public interaction: Interaction) {
    this.authorId = interaction.user.id;
    this.guildId = interaction.guildId;
    this.channelId = interaction.channelId;

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
    data:
      | string
      | (Omit<InteractionCallbackData, "embeds">) & {
        embeds?: (Embed | EmbedBuilder)[];
      }
      | EmbedBuilder
      | EmbedBuilder[],
    replyOptions?: { wait?: boolean; private?: boolean },
  ): Promise<Message | undefined> {
    if (typeof data === "string") data = { content: data };
    else if (data instanceof EmbedBuilder) data = { embeds: [data.toJSON()] };
    else if (Array.isArray(data)) {
      data = { embeds: data.map((e) => e.toJSON()) };
    } else {
      data.embeds = data.embeds?.map((e) =>
        e instanceof EmbedBuilder ? e.toJSON() : e
      );
    }

    if (replyOptions?.private && !data.flags) data.flags = 64; // private: true

    let responseMessage: Message | undefined;
    if (this.replied) {
      responseMessage = await this.#replyFollowup(
        data as InteractionCallbackData,
      );
    } else {
      responseMessage = await this.#replyOriginal(
        data as InteractionCallbackData,
      );
      if (replyOptions?.wait) {
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

  get botMember() {
    if (!this.guildId) {
      throw new Error(
        "Cannot get the author of the interaction as a member, no guild id was found.",
      );
    }

    return getOrFetchMember(this.bot, this.guildId, this.bot.id);
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

  get channel() {
    if (!this.channelId) {
      throw new Error(
        "Cannot get the channel of the interaction, no channel id was found.",
      );
    }

    return getOrFetchChannel(this.bot, this.channelId);
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
      data,
    );
  }
}

export { ApplicationCommandContext };
