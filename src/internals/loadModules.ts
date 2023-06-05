import { CustomBot } from "client";

interface Module {
  name: string;
  init: (bot: CustomBot) => CustomBot | Promise<CustomBot>;
}

const pathToModuleDirectory = "modules";

async function loadModules(bot: CustomBot): Promise<CustomBot> {
  // imports modules from the module folder and adds them into a collection (bot.loadedModules)
  bot.logger.info(
    "Started importing all modules and adding them to the module cache",
  );
  await importModules(bot);
  bot.logger.info(
    `Successfully imported ${bot.loadedModules.size} modules\n${
      bot.loadedModules.map((module) => module.name).join(" - ")
    }`,
  );

  // execute the init method of each module, one by one
  bot.logger.info("Started initializing modules");
  await initializeModules(bot);
  bot.logger.info("Finished initializing modules");

  return bot;
}

async function importModules(bot: CustomBot) {
  for await (const entry of Deno.readDir(`./src/${pathToModuleDirectory}/`)) {
    if (entry.isFile) {
      try {
        const { default: module_ } = await import(
          `../${pathToModuleDirectory}/${entry.name}`
        );

        const module: Module = module_;

        bot.loadedModules.set(module.name, module);
      } catch (error) {
        bot.logger.error(error);
      }
    }
  }
}

async function initializeModules(bot: CustomBot) {
  for (const module of bot.loadedModules.values()) {
    console.log(module);
    await module.init(bot);
    bot.logger.info(`Module ${module.name} initialized`);
  }
}

export { loadModules };
export type { Module };
