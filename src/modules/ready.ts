import { Module } from "internals/loadModules.ts";
import handleReadySubmodules from "./ready/mod.ts";

const readyModule: Module = {
  name: "ready",
  init: (bot) => {
    const { ready } = bot.events;
    bot.events.ready = async (_bot, payload, rawPayload) => {
      ready(_bot, payload, rawPayload);

      await handleReadySubmodules(bot);

      bot.logger.info("Bot is ready");
    };
    return bot;
  },
};

export default readyModule;
