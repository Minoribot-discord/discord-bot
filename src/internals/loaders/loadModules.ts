import { CustomBot } from "internals";
import { Module } from "structures";

const pathToModuleDirectory = "plugins/modules";

async function loadModules(bot: CustomBot): Promise<CustomBot> {
  bot.logger.info(
    "Started loading modules",
  );

  bot.modules.clear();

  /*
     imports modules from the module folder
     and adds them into a collection (bot.modules)
  */
  await importModules(bot);

  bot.logger.info("Started initializing modules");
  // execute the init method of each module, one by one
  await initializeModules(bot);
  bot.logger.info("Finished initializing modules");

  return bot;
}

async function importModules(bot: CustomBot) {
  for await (const entry of Deno.readDir(`./src/${pathToModuleDirectory}/`)) {
    if (entry.isFile) {
      try {
        const { default: module } = await import(
          `${pathToModuleDirectory}/${entry.name}`
        );
        if (
          !module || typeof module !== "object" ||
          !(module instanceof Module)
        ) continue;

        bot.modules.set(module.name, module);
      } catch (error) {
        bot.logger.error(error);
      }
    }
  }
}

async function initializeModules(bot: CustomBot) {
  const modules = Array.from(bot.modules.values());
  const sortedModules = modules.sort((a, b) => a.priority - b.priority);

  for (const module of sortedModules) {
    await module.init(bot);
    bot.logger.info(`Module ${module.name} initialized`);
  }
}

export { loadModules };
