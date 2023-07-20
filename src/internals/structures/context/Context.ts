import { Embed, Interaction, InteractionCallbackData } from "deps";
import { CustomBot, EmbedBuilder } from "internals";
import {
  getOrFetchChannel,
  getOrFetchGuild,
  getOrFetchMember,
  getOrFetchUser,
} from "utils";
import { ArgumentParser } from "structures";

class Context {
  authorId: bigint;
  guildId: bigint | undefined;
  channelId: bigint | undefined;

  args: ArgumentParser;

  deferred = false;

  constructor(public bot: CustomBot, public interaction: Interaction) {
    this.authorId = interaction.user.id;
    this.guildId = interaction.guildId;
    this.channelId = interaction.channelId;

    this.args = new ArgumentParser(interaction.data?.options);
  }

  interactionRespond(
    response: string | InteractionCallbackData,
    options?: { isPrivate?: boolean },
  ) {
    return this.interaction.respond(response, options);
  }

  async defer(isPrivate?: boolean) {
    await this.interaction.defer(isPrivate);

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
    replyOptions?: { wait?: boolean; isPrivate?: boolean },
  ) {
    if (typeof data === "string") data = { content: data };
    else if (data instanceof EmbedBuilder) data = { embeds: [data.toJSON()] };
    else if (Array.isArray(data)) {
      data = { embeds: data.map((embedBuilder) => embedBuilder.toJSON()) };
    } else {
      data.embeds = data.embeds?.map((e) =>
        e instanceof EmbedBuilder ? e.toJSON() : e
      );
    }
    if (replyOptions?.isPrivate && !data.flags) data.flags = 64; // private: true

    return await this.interactionRespond(data as InteractionCallbackData);
  }

  async getAuthor() {
    return await getOrFetchUser(this.bot, this.interaction.user.id);
  }

  async getBotMember() {
    if (!this.guildId) {
      throw new Error(
        "Cannot get the author of the interaction as a member, no guild id was found.",
      );
    }

    return await getOrFetchMember(this.bot, this.guildId, this.bot.id);
  }

  async getAuthorMember() {
    if (!this.guildId) {
      throw new Error(
        "Cannot get the author of the interaction as a member, no guild id was found.",
      );
    }
    return await getOrFetchMember(this.bot, this.guildId, this.authorId);
  }

  async getGuild() {
    if (!this.guildId) {
      throw new Error(
        "Cannot get the guild of the interaction, no guild id was found.",
      );
    }

    return await getOrFetchGuild(this.bot, this.guildId);
  }

  async getChannel() {
    if (!this.channelId) {
      throw new Error(
        "Cannot get the channel of the interaction, no channel id was found.",
      );
    }

    return await getOrFetchChannel(this.bot, this.channelId);
  }

  get acknowledged() {
    return this.interaction.acknowledged;
  }
}

export { Context };
