import { Module } from "classes";

export default new Module({
  name: "ready",
  priority: 999,
  init: (bot) => {
    const { ready } = bot.events;

    bot.events.ready = async (_bot, payload, rawPayload) => {
      await ready(_bot, payload, rawPayload);

      bot.logger.info("Bot is ready");
    };

    return bot;
  },
});
