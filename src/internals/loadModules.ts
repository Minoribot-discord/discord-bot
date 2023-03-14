import { CustomBot } from "client";
import { fs } from "deps";

interface Module {
  name: string;
  init: (bot: CustomBot) => CustomBot | Promise<CustomBot>;
}

async function importModules(bot: CustomBot) {
  for await (const entry of fs.walk("./src/modules/")) {
    if (entry.isFile) {
      try {
        const { default: module_ } = await import(
          `../../${entry.path}`
        );

        const module: Module = module_;

        bot.loadedModules.set(module.name, module);
      } catch (error) {
        bot.logger.error(error);
      }
    }
  }
}

async function initModules(bot: CustomBot) {
  for (const module of bot.loadedModules.values()) {
    try {
      await module.init(bot);
      bot.logger.info(`Module ${module.name} initialized`);
    } catch (error) {
      bot.logger.error(error);
    }
  }
}

async function loadModules(bot: CustomBot): Promise<CustomBot> {
  await importModules(bot);
  await initModules(bot);
  return bot;
}

export { loadModules };
export type { Module };
