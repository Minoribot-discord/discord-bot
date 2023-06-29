// Code ripped of from "https://github.com/AmethystFramework/framework/blob/cad30879bc6ac6b93a123a9a80e025fa4b06fc47/src/interfaces/collectors.ts"

import { Emoji, Interaction, Message } from "deps";
import { CustomBot } from "internals/CustomBot.ts";
import { LocaleKeys } from "structures";

export interface AmethystReaction {
  /** The emoji name */
  name: string;
  /** The emoji id */
  id: bigint;
  /** The reactor's id */
  userId: bigint;
  /** The reaction message's guild id*/
  guildId?: bigint;
  /**The reaction's message id*/
  messageId: bigint;
  /** The channel where the message is */
  channelId: bigint;
}

// Collect Options
export interface BaseCollectorCreateOptions {
  /** The unique key that will be used to get responses for this.*/
  key: string;
  /** The amount of messages to collect before resolving. */
  maxUsage: number;
  /** The timestamp when this collector was created */
  createdAt: number;
  /** The duration in milliseconds how long this collector should last. */
  timeout: number;
}

export interface CollectMessagesOptions extends BaseCollectorCreateOptions {
  /** The channel Id where this is listening to */
  channelId: bigint;
  /** Function that will filter messages to determine whether to collect this message */
  filter: (bot: CustomBot, message: Message) => boolean;
}

export interface CollectComponentsOptions
  extends Omit<BaseCollectorCreateOptions, "key"> {
  key: bigint;
  filter: (bot: CustomBot, data: Interaction) => boolean;
}

export interface CollectReactionsOptions
  extends Omit<BaseCollectorCreateOptions, "key"> {
  key: bigint;
  filter: (
    bot: CustomBot,
    payload: {
      messageId: bigint;
      channelId: bigint;
      guildId?: bigint;
      userId: bigint;
      emoji: Emoji;
    },
  ) => boolean;
}
// Collector Options

export interface BaseCollectorOptions {
  /** The max amount to collect before expiring. Defaults to 1*/
  maxUsage?: number;
  /** The amount of milliseconds it is gonna collect for before expiring. Defaults to 15 minutes*/
  timeout?: number;
}

export interface MessageCollectorOptions extends BaseCollectorOptions {
  /** A function to filter the messages and determine whether to collect or not */
  filter?: (bot: CustomBot, message: Message) => boolean;
}

export interface ReactionCollectorOptions extends BaseCollectorOptions {
  /** A function to filter the messages and determine whether to collect or not */
  filter?: (
    bot: CustomBot,
    payload: {
      messageId: bigint;
      channelId: bigint;
      guildId?: bigint;
      userId: bigint;
      emoji: Emoji;
    },
  ) => boolean;
}

export interface ComponentCollectorOptions extends BaseCollectorOptions {
  /** A function to filter the messages and determine whether to collect or not */
  filter?: (bot: CustomBot, data: Interaction) => boolean;
  /** The type of the component to collect */
  type?: "Button" | "SelectMenu" | "TextInput";
}

// Todo: Replace "any" by a translation key, in "reject"

type RejectFunc = (reason?: LocaleKeys) => void;

// Collectors
export interface ReactionCollector extends CollectReactionsOptions {
  resolve: (
    value: AmethystReaction[] | PromiseLike<AmethystReaction[]>,
  ) => void;
  reject: RejectFunc;
  /** Where the reactions are stored if the amount to collect is more than 1. */
  reactions: AmethystReaction[];
}

export interface MessageCollector extends CollectMessagesOptions {
  resolve: (value: Message[] | PromiseLike<Message[]>) => void;
  reject: RejectFunc;
  /** Where the messages are stored if the amount to collect is more than 1. */
  messages: Message[];
}

export interface ComponentCollector extends CollectComponentsOptions {
  resolve: (value: Interaction[] | PromiseLike<Interaction[]>) => void;
  reject: RejectFunc;
  /** Where the interactions are stored if the amount to collect is more than 1. */
  components: Interaction[];
}
