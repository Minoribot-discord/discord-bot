import { Collection } from "deps";
import { Command, CommandScope } from "structures";
import { createModule } from "internals/loadStuff.ts";
import { CustomBot } from "internals/CustomBot.ts";

createModule({
  name: "refreshApplicationCommands",
  priority: 0,
  init: (bot: CustomBot) => {
    const { ready } = bot.events;

    bot.events.ready = async (_bot, payload, rawPayload) => {
      await ready(_bot, payload, rawPayload);

      if (bot.config.refreshCommands && !bot.ready) {
        await bot.utils.delay(2000);

        await removeNonExistentApplicationCommands(bot);
        await handleGuildScopedCommands(bot);
        await handleGlobalScopedCommands(bot);
      }
    };

    return bot;
  },
});

async function removeNonExistentApplicationCommands(bot: CustomBot) {
  bot.logger.info(
    "Remove non-existent application commands from the API",
  );
  for (const guildId of bot.guilds.keys()) {
    const guildApplicationCommands = await bot.helpers
      .getGuildApplicationCommands(guildId);

    for (const command of guildApplicationCommands.values()) {
      if (!bot.commands.has(command.name)) {
        await bot.helpers.deleteGuildApplicationCommand(command.id, guildId);
      }
    }
  }

  bot.logger.info(
    "Remove non-existent global application commands from the API",
  );
  const globalApplicationCommands = await bot.helpers
    .getGlobalApplicationCommands();

  for (const command of globalApplicationCommands.values()) {
    if (!bot.commands.has(command.name)) {
      await bot.helpers.deleteGlobalApplicationCommand(command.id);
    }
  }
}

async function handleGuildScopedCommands(bot: CustomBot) {
  const guildScopedCommands = new Collection<bigint, Command[]>();

  // iterate over guild scoped commands
  for (
    const command of bot.commands.filter((command) =>
      command.scope === CommandScope.GUILD
    ).values()
  ) {
    for (const guildId of command.guildIds) {
      const commandsForOneGuild = guildScopedCommands.get(guildId) || [];
      commandsForOneGuild.push(command);

      guildScopedCommands.set(guildId, commandsForOneGuild);
    }
  }

  for (const [guildId, commands] of guildScopedCommands) {
    await bot.helpers.upsertGuildApplicationCommands(
      guildId,
      commands.map((command) => command.discordApplicationCommand),
    );
  }

  bot.logger.info("Successfully upserted guild scoped commands to the API");
}

async function handleGlobalScopedCommands(bot: CustomBot) {
  const globalScopedCommands = bot.commands.filter((command) =>
    command.scope === CommandScope.GLOBAL
  );
  const discordAppCommands = globalScopedCommands.map((command) =>
    command.discordApplicationCommand
  );

  if (bot.config.devMode) {
    bot.logger.warning(
      "Dev mode detected, global commands will be loaded for each guild instead of globally",
    );
    for (const guildId of bot.guilds.keys()) {
      await bot.helpers.upsertGuildApplicationCommands(
        guildId,
        discordAppCommands,
      );
    }
  } else {
    await bot.helpers.upsertGlobalApplicationCommands(
      discordAppCommands,
    );
  }

  bot.logger.info("Successfully upserted global scoped commands to the API");
}
