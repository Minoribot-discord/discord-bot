import {
  Interaction,
  InteractionCallbackData,
  InteractionResponse,
  InteractionResponseTypes,
  Message,
} from "deps";
import {
  CustomBot,
  DatabaseHandler,
  getArgsLocaleKey,
  Locale,
  LocaleKeys,
} from "internals";
import { getOrFetchGuild, getOrFetchMember, getOrFetchUser } from "utils";

interface ContextParams {
  bot: CustomBot;
  interaction: Interaction;
}
class Context {
  bot: CustomBot;
  interaction: Interaction;
  db: DatabaseHandler;

  i18n: I18nContextHandler;

  authorId: bigint;
  guildId: bigint | undefined;

  deferred = false;
  replied = false;

  constructor(params: ContextParams) {
    const { bot, interaction } = params;

    this.bot = bot;
    this.interaction = interaction;
    this.db = bot.db;

    this.authorId = interaction.user.id;
    this.guildId = interaction.guildId;

    this.i18n = new I18nContextHandler({ parent: this });
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
        responseMessage = await this.bot.helpers.getOriginalInteractionResponse(
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
    if (!this.deferred) {
      await this.sendInteractionResponse(
        { type: InteractionResponseTypes.ChannelMessageWithSource, data },
      );
    } else {
      return await this.bot.helpers.editOriginalInteractionResponse(
        this.interaction.token,
        data,
      );
    }

    this.replied = true;
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

interface I18nContextHandlerParams {
  parent: Context;
}
class I18nContextHandler {
  bot: CustomBot;
  parent: Context;
  locale: Locale;

  constructor(params: I18nContextHandlerParams) {
    const { parent } = params;

    this.bot = parent.bot;
    this.parent = parent;
    this.locale = parent.bot.locales.get("cat-central") || (() => {
      throw new Error("Cannot find locale cat-central");
    })();
  }

  translate<K extends LocaleKeys>(
    key: K,
    params?: getArgsLocaleKey<K>,
  ) {
    return this.bot.i18n.translate<K>(this.locale, key, params);
  }
}

export { Context, I18nContextHandler };
