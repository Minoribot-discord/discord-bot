import { CustomBot, Inhibitor } from "structures";
import { fs } from "deps";
const pathToInhibitorDirectory = "inhibitors";

async function loadInhibitors(bot: CustomBot) {
  bot.logger.info("Started loading inhibitors");

  for await (const walkEntry of fs.walk(`./src/${pathToInhibitorDirectory}`)) {
    if (walkEntry.isFile) {
      const { default: inhibitor_ } = await import(`../../${walkEntry.path}`);

      const inhibitor: Inhibitor = inhibitor_;

      bot.inhibitors.set(inhibitor.name, inhibitor);
    }
  }
}

export { loadInhibitors };
