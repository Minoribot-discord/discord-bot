import { ActivityTypes } from "deps";
import { createModule } from "internals/loadStuff.ts";
import { CustomBot } from "internals/CustomBot.ts";

createModule({
  name: "ready",
  priority: 999,
  init: (bot) => {
    const { ready } = bot.events;

    bot.events.ready = async (payload, rawPayload) => {
      await ready?.(payload, rawPayload);

      if ((payload.shardId !== bot.gateway.lastShardId) && bot.ready) return;
      bot.ready = true;

      await bot.gateway.editBotStatus({
        activities: [{
          name: "Visca les llengues minoritzades",
          type: ActivityTypes.Game,
        }],
        status: "online",
      });

      bot.logger.info("Bot is ready");

      let string_ = "\n";

      string_ = string_ +
        `${bot.cmdCategories.size} command categories\n`;

      string_ = string_ +
        `${bot.commands.size} commands (${bot.subCommands.size} subcommands/groups)\n`;

      string_ = string_ +
        `${bot.inhibitors.size} inhibitors\n`;

      string_ = string_ +
        `${bot.modules.size} modules\n`;

      string_ = string_ +
        `${bot.locales.size} locales`;

      bot.logger.info(string_);

      checkIfCommandsHaveExecuteFunction(bot);
    };

    return bot;
  },
});

function checkIfCommandsHaveExecuteFunction(bot: CustomBot) {
  for (const command of bot.commands.values()) {
    if (!command.execute && command.subCommands.length === 0) {
      bot.logger.warn(
        `Command ${command.name} has no execute function and no subcommands.`,
      );
    }
  }
}
