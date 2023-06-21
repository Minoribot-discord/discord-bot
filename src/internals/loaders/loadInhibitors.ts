import { CustomBot } from "internals";
import { Inhibitor } from "structures";
import { fs } from "deps";
const pathToInhibitorDirectory = "plugins/inhibitors";

async function loadInhibitors(bot: CustomBot) {
  bot.logger.info("Started loading inhibitors");

  bot.inhibitors.clear();

  for await (const walkEntry of fs.walk(`./src/${pathToInhibitorDirectory}`)) {
    if (walkEntry.isFile) {
      const { default: inhibitor } = await import(
        `${pathToInhibitorDirectory}/${walkEntry.path}`
      );
      if (
        !inhibitor || typeof inhibitor !== "object" ||
        !(inhibitor instanceof Inhibitor)
      ) continue;

      bot.inhibitors.set(inhibitor.name, inhibitor);
    }
  }
}

export { loadInhibitors };
