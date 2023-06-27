import { createModule } from "internals/loadStuff.ts";

createModule({
  name: "ready",
  priority: 999,
  init: (bot) => {
    const { ready } = bot.events;

    bot.events.ready = async (_bot, payload, rawPayload) => {
      await ready(_bot, payload, rawPayload);

      bot.logger.info("Bot is ready");

      // show a list of loaded commands, modules and inhibitors

      // let string_ = "";

      // string_ = string_ +
      //   `${bot.loadedCmdCategories.size} command categories:\n   ${
      //     bot.loadedCmdCategories.map((category) => category.name).join(" - ")
      //   }\n`;

      // string_ = string_ +
      //   `${bot.loadedCommands.size} commands (${bot.loadedSubCommands.size} subcommands/groups):\n    ${
      //     bot.loadedCommands.map((command) => command.name).join(" - ")
      //   }\n`;

      // string_ = string_ +
      //   `${bot.loadedInhibitors.size} inhibitors:\n   ${
      //     bot.loadedInhibitors.map((inhibitor) => inhibitor.name).join(" - ")
      //   }\n`;

      // string_ = string_ +
      //   `${bot.loadedModules.size} modules:\n   ${
      //     bot.loadedModules.map((module) => module.name).join(" - ")
      //   }`;

      let string_ = "";

      string_ = string_ +
        `${bot.cmdCategories.size} command categories\n`;

      string_ = string_ +
        `${bot.commands.size} commands (${bot.subCommands.size} subcommands/groups)\n`;

      string_ = string_ +
        `${bot.inhibitors.size} inhibitors\n`;

      string_ = string_ +
        `${bot.modules.size} modules\n`;

      string_ = string_ +
        `${bot.locales.size} locals`;

      bot.logger.info(string_);
    };

    return bot;
  },
});
