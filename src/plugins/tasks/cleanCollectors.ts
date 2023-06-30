import { loadTask } from "internals/loadStuff.ts";
import { CollectorErrorCodes } from "structures";

loadTask({
  name: "collectors",
  interval: (10 * 60) * 1000, // Every 10 minutes

  // Code ripped of from "https://github.com/AmethystFramework/framework/blob/4bd01b466d4e3435adf26c57d887a7c7416f3e42/src/utils/extra.ts"
  execute: (bot) => {
    const now = Date.now();

    // Component collectors
    for (const [key, collector] of bot.collectors.components) {
      if (collector.createdAt + collector.timeout > now) continue;

      bot.collectors.components.delete(key);

      collector.resolve({ error: CollectorErrorCodes.TIMEOUT });
    }

    // Reaction collectors
    for (const [key, collector] of bot.collectors.reactions) {
      if (collector.createdAt + collector.timeout > now) continue;

      bot.collectors.reactions.delete(key);

      collector.resolve({ error: CollectorErrorCodes.TIMEOUT });
    }

    // Message collectors
    for (const [key, collector] of bot.collectors.messages) {
      if (collector.createdAt + collector.timeout > now) continue;

      bot.collectors.messages.delete(key);

      collector.resolve({ error: CollectorErrorCodes.TIMEOUT });
    }

    bot.logger.info("Cleaned up collectors");
  },
});
