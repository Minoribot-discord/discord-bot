import { Module } from "internals/loadModules.ts";

const readyModule: Module = {
  name: "ready",
  init: (bot) => {
    const { ready } = bot.events;
    bot.events.ready = (_bot, payload, rawPayload) => {
      ready(_bot, payload, rawPayload);

      bot.logger.info("Bot is ready");
    };
    return bot;
  },
};

export default readyModule;
