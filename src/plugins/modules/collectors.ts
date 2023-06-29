import { Emoji, Interaction, InteractionTypes, Message } from "deps";
import { createModule } from "internals/loadStuff.ts";
import { CustomBot } from "internals/CustomBot.ts";

createModule({
  name: "collectors",

  init: (bot) => {
    const { messageCreate, reactionAdd, interactionCreate } = bot.events;

    cleanCollectorsTask(bot);

    bot.events.messageCreate = (_bot, message) => {
      messageCreate(_bot, message);

      handleMessageCollector(bot, message);
    };

    bot.events.reactionAdd = (_bot, payload) => {
      reactionAdd(_bot, payload);

      handleReactionCollector(bot, payload);
    };

    bot.events.interactionCreate = (_bot, interaction) => {
      interactionCreate(_bot, interaction);

      switch (interaction.type) {
        case InteractionTypes.MessageComponent:
          handleComponentCollector(bot, interaction);
      }
    };

    return bot;
  },
});

function cleanCollectorsTask(bot: CustomBot) {
  // To-do add tasks and turn this into a task
  setInterval(() => {
    const now = Date.now();
    // deno-lint-ignore require-await
    (async () => {
      for (const [key, collector] of bot.collectors.components) {
        if (collector.createdAt + collector.timeout > now) continue;

        bot.collectors.components.delete(key);

        collector.reject("COLLECTORS.COMPONENTS.REJECT.TIMEOUT");
      }
    })();
    // deno-lint-ignore require-await
    (async () => {
      for (const [key, collector] of bot.collectors.reactions) {
        if (collector.createdAt + collector.timeout > now) continue;

        bot.collectors.reactions.delete(key);

        collector.reject("COLLECTORS.REACTIONS.REJECT.TIMEOUT");
      }
    })();
    // deno-lint-ignore require-await
    (async () => {
      for (const [key, collector] of bot.collectors.messages) {
        if (collector.createdAt + collector.timeout > now) continue;

        bot.collectors.messages.delete(key);

        collector.reject("COLLECTORS.MESSAGES.REJECT.TIMEOUT");
      }
    })();
  }, (10 * 60) * 1000);
}

// Functions ripped of from "https://github.com/AmethystFramework/framework/blob/4bd01b466d4e3435adf26c57d887a7c7416f3e42/src/utils/extra.ts"

function handleMessageCollector(
  bot: CustomBot,
  message: Message,
) {
  const collector = bot.collectors.messages.get(
    `${message.authorId}-${message.channelId}`,
  );
  // This user has no collectors pending or the message is in a different channel
  if (!collector || message.channelId !== collector.channelId) return;
  // This message is a response to a collector. Now running the filter function.
  if (!collector.filter(bot, message)) return;

  // If the necessary amount has been collected
  if (
    collector.maxUsage === 1 ||
    collector.maxUsage === collector.messages.length + 1
  ) {
    // Remove the collector
    bot.collectors.messages.delete(`${message.authorId}-${message.channelId}`);
    // Resolve the collector
    return collector.resolve([...collector.messages, message]);
  }

  // More messages still need to be collected
  collector.messages.push(message);
}

function handleReactionCollector(
  bot: CustomBot,
  payload: {
    messageId: bigint;
    userId: bigint;
    channelId: bigint;
    guildId?: bigint;
    emoji: Emoji;
  },
) {
  const collector = bot.collectors.reactions.get(payload.messageId);
  if (!collector || !payload.emoji.name || !payload.emoji.id) return;
  if (!collector.filter(bot, payload)) return;

  if (
    collector.maxUsage === 1 ||
    collector.maxUsage === collector.reactions.length + 1
  ) {
    bot.collectors.reactions.delete(collector.key);
    return collector.resolve([
      ...collector.reactions,
      {
        name: payload.emoji.name,
        id: payload.emoji.id,
        userId: payload.userId,
        channelId: payload.channelId,
        messageId: payload.messageId,
        guildId: payload.guildId,
      },
    ]);
  }

  collector.reactions.push({
    userId: payload.userId,
    channelId: payload.channelId,
    messageId: payload.messageId,
    guildId: payload.guildId,
    name: payload.emoji.name,
    id: payload.emoji.id,
  });
}

function handleComponentCollector(bot: CustomBot, data: Interaction) {
  const collector = bot.collectors.components.get(data.message?.id || 0n);
  if (!collector) return;
  if (!collector.filter(bot, data)) return;

  if (
    collector.maxUsage === 1 ||
    collector.maxUsage === collector.components.length + 1
  ) {
    bot.collectors.components.delete(collector.key);
    return collector.resolve([...collector.components, data]);
  }

  collector.components.push(data);
}
