// Code ripped of from "https://github.com/AmethystFramework/framework/blob/cad30879bc6ac6b93a123a9a80e025fa4b06fc47/src/utils/Collectors.ts"

import { Collection, Interaction, Message } from "deps";
import {
  AmethystReaction,
  CollectComponentsOptions,
  CollectMessagesOptions,
  CollectReactionsOptions,
  ComponentCollector,
  ComponentCollectorOptions,
  MessageCollector,
  MessageCollectorOptions,
  ReactionCollector,
  ReactionCollectorOptions,
} from "structures";

export const collectors = {
  messages: new Collection<string, MessageCollector>(),
  components: new Collection<bigint, ComponentCollector>(),
  reactions: new Collection<bigint, ReactionCollector>(),
};

// Component collectors
export async function awaitComponent(
  messageId: bigint,
  options?: ComponentCollectorOptions & { maxUsage?: 1 },
): Promise<Interaction>;
export async function awaitComponent(
  messageId: bigint,
  options?: ComponentCollectorOptions & { maxUsage?: number },
): Promise<Interaction[]>;
export async function awaitComponent(
  messageId: bigint,
  options?: ComponentCollectorOptions,
): Promise<Interaction>;
export async function awaitComponent(
  messageId: bigint,
  options?: ComponentCollectorOptions,
) {
  const interactions = await collectComponents({
    key: messageId,
    createdAt: Date.now(),
    filter: options?.filter || (() => true),
    maxUsage: options?.maxUsage || 1,
    timeout: options?.timeout || 1000 * 60 * 15,
  });
  return (options?.maxUsage || 1) > 1 ? interactions : interactions[0];
}

function collectComponents(
  options: CollectComponentsOptions,
): Promise<Interaction[]> {
  return new Promise((resolve, reject) => {
    collectors.components
      .get(options.key)
      ?.reject(
        "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE",
      );

    collectors.components.set(options.key, {
      ...options,
      components: [],
      resolve,
      reject,
    });
  });
}

// Reaction collector
export async function awaitReaction(
  messageId: bigint,
  options?: ReactionCollectorOptions & { maxUsage?: 1 },
): Promise<AmethystReaction>;
export async function awaitReaction(
  messageId: bigint,
  options?: ReactionCollectorOptions & { maxUsage?: number },
): Promise<AmethystReaction[]>;
export async function awaitReaction(
  messageId: bigint,
  options?: ReactionCollectorOptions,
): Promise<AmethystReaction>;
export async function awaitReaction(
  messageId: bigint,
  options?: ReactionCollectorOptions,
) {
  const reactions = await collectReactions({
    key: messageId,
    createdAt: Date.now(),
    filter: options?.filter || (() => true),
    maxUsage: options?.maxUsage || 1,
    timeout: options?.timeout || 1000 * 60 * 15,
  });
  return (options?.maxUsage || 1) > 1 ? reactions : reactions[0];
}

function collectReactions(
  options: CollectReactionsOptions,
): Promise<AmethystReaction[]> {
  return new Promise((resolve, reject) => {
    collectors.reactions
      .get(options.key)
      ?.reject(
        "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE",
      );

    collectors.reactions.set(options.key, {
      ...options,
      reactions: [],
      resolve,
      reject,
    });
  });
}

// Message collector
export async function awaitMessage(
  memberId: bigint,
  channelId: bigint,
  options?: MessageCollectorOptions & { maxUsage?: 1 },
): Promise<Message>;
export async function awaitMessage(
  memberId: bigint,
  channelId: bigint,
  options?: MessageCollectorOptions & { maxUsage?: number },
): Promise<Message[]>;
export async function awaitMessage(
  memberId: bigint,
  channelId: bigint,
  options?: MessageCollectorOptions,
): Promise<Message>;
export async function awaitMessage(
  memberId: bigint,
  channelId: bigint,
  options?: MessageCollectorOptions,
) {
  const messages = await collectMessages({
    key: `${memberId}-${channelId}`,
    channelId,
    createdAt: Date.now(),
    filter: options?.filter || (() => true),
    maxUsage: options?.maxUsage || 1,
    timeout: options?.timeout || 1000 * 60 * 15,
  });
  return (options?.maxUsage || 1) > 1 ? messages : messages[0];
}

function collectMessages(
  options: CollectMessagesOptions,
): Promise<Message[]> {
  return new Promise((resolve, reject) => {
    collectors.messages
      .get(options.key)
      ?.reject(
        "COLLECTORS.GLOBAL.REJECT.COLLECTOR_BEGAN_BEFORE",
      );

    collectors.messages.set(options.key, {
      ...options,
      messages: [],
      resolve,
      reject,
    });
  });
}
