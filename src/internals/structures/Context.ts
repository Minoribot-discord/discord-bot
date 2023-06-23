import {
  Interaction,
  InteractionCallbackData,
  InteractionResponse,
  InteractionResponseTypes,
  InteractionTypes,
  Message,
} from "deps";
import {
  CustomBot,
  customBot,
  DatabaseHandler,
  getArgsLocaleKey,
  Locale,
  LocaleKeys,
} from "internals";
import { getOrFetchGuild, getOrFetchMember, getOrFetchUser } from "utils";

class Context {
  interaction: Interaction;

  i18n: I18nContextHandler;

  authorId: bigint;
  guildId: bigint | undefined;

  deferred = false;
  replied = false;

  constructor(interaction: Interaction) {
    this.interaction = interaction;

    this.authorId = interaction.user.id;
    this.guildId = interaction.guildId;

    this.i18n = new I18nContextHandler({ parent: this });
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

interface I18nContextHandlerParams {
  parent: Context;
}
class I18nContextHandler {
  parent: Context;
  locale: Locale;

  constructor(params: I18nContextHandlerParams) {
    const { parent } = params;

    this.parent = parent;
    this.locale = customBot.locales.get("cat-central") || (() => {
      throw new Error("Cannot find locale cat-central");
    })();
  }

  translate<K extends LocaleKeys>(
    key: K,
    params?: getArgsLocaleKey<K>,
  ) {
    return customBot.i18n.translate<K>(this.locale, key, params);
  }
}

export { Context, I18nContextHandler };
