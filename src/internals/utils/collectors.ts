// Code ripped of from "https://github.com/AmethystFramework/framework/blob/cad30879bc6ac6b93a123a9a80e025fa4b06fc47/src/utils/Collectors.ts"

import { Collection, Interaction, Message } from "deps";
import {
  AmethystReaction,
  CollectComponentsOptions,
  CollectMessagesOptions,
  CollectorErrorCodes,
  CollectorResults,
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
export function awaitComponent(
  messageId: bigint,
  options?: ComponentCollectorOptions,
): Promise<CollectorResults<Interaction>> {
  return collectComponents({
    key: messageId,
    createdAt: Date.now(),
    filter: options?.filter || (() => true),
    maxUsage: options?.maxUsage || 1,
    timeout: options?.timeout || 1000 * 60 * 15,
    collect: options?.collect,
    filterReject: options?.filterReject,
  });
}

function collectComponents(
  options: CollectComponentsOptions,
): Promise<CollectorResults<Interaction>> {
  return new Promise((resolve, reject) => {
    collectors.components
      .get(options.key)
      ?.resolve({ error: CollectorErrorCodes.COLLECTOR_BEGAN_BEFORE_OLD_ONE });

    collectors.components.set(options.key, {
      ...options,
      components: [],
      resolve,
      reject,
    });
  });
}

// Reaction collector
export function awaitReaction(
  messageId: bigint,
  options?: ReactionCollectorOptions,
): Promise<CollectorResults<AmethystReaction>> {
  return collectReactions({
    key: messageId,
    createdAt: Date.now(),
    filter: options?.filter || (() => true),
    maxUsage: options?.maxUsage || 1,
    timeout: options?.timeout || 1000 * 60 * 15,
    collect: options?.collect,
    filterReject: options?.filterReject,
  });
}

function collectReactions(
  options: CollectReactionsOptions,
): Promise<CollectorResults<AmethystReaction>> {
  return new Promise((resolve, reject) => {
    collectors.reactions
      .get(options.key)
      ?.resolve({ error: CollectorErrorCodes.COLLECTOR_BEGAN_BEFORE_OLD_ONE });

    collectors.reactions.set(options.key, {
      ...options,
      reactions: [],
      resolve,
      reject,
    });
  });
}

// Message collector
export function awaitMessage(
  memberId: bigint,
  channelId: bigint,
  options?: MessageCollectorOptions,
): Promise<CollectorResults<Message>> {
  return collectMessages({
    key: `${memberId}-${channelId}`,
    channelId,
    createdAt: Date.now(),
    filter: options?.filter || (() => true),
    maxUsage: options?.maxUsage || 1,
    timeout: options?.timeout || 1000 * 60 * 15,
    collect: options?.collect,
    filterReject: options?.filterReject,
  });
}

function collectMessages(
  options: CollectMessagesOptions,
): Promise<CollectorResults<Message>> {
  return new Promise((resolve, reject) => {
    collectors.messages
      .get(options.key)
      ?.resolve({ error: CollectorErrorCodes.COLLECTOR_BEGAN_BEFORE_OLD_ONE });

    collectors.messages.set(options.key, {
      ...options,
      messages: [],
      resolve,
      reject,
    });
  });
}
