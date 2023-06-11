import { Collection } from "deps";
import { Command, CommandScope, Module } from "classes";
import { CustomBot } from "client";

export default new Module({
  name: "refreshApplicationCommands",
  priority: 0,
  init: (bot: CustomBot) => {
    const { ready } = bot.events;

    bot.events.ready = async (_bot, payload, rawPayload) => {
      ready(_bot, payload, rawPayload);

      if (bot.config.refreshCommands) {
        await bot.utils.delay(3000);

        await purgeAllApplicationCommands(bot);
        await handleSupportGuildScopedCommands(bot);
        await handleGuildScopedCommands(bot);
        await handleGlobalScopedCommands(bot);
      }
    };

    return bot;
  },
});

async function purgeAllApplicationCommands(bot: CustomBot) {
  bot.logger.info("Purging guild application commands from the API");
  for (const guildId of bot.guilds.keys()) {
    const guildApplicationCommands = await bot.helpers
      .getGuildApplicationCommands(guildId);

    for (const commandId of guildApplicationCommands.keys()) {
      await bot.helpers.deleteGuildApplicationCommand(commandId, guildId);
    }
  }

  bot.logger.info("Purging global application commands from the API");
  const globalApplicationCommands = await bot.helpers
    .getGlobalApplicationCommands();

  for (const commandId of globalApplicationCommands.keys()) {
    await bot.helpers.deleteGlobalApplicationCommand(commandId);
  }
}

async function handleGuildScopedCommands(bot: CustomBot) {
  const guildScopedCommands = new Collection<bigint, Command[]>();

  // iterate over guild scoped commands
  for (
    const command of bot.loadedCommands.filter((command) =>
      command.scope === CommandScope.GUILD
    ).values()
  ) {
    if (command.guildIds.length === 0) {
      throw new Error(
        `Guild scope command "${command.name}" needs to have at least one guild id`,
      );
    }

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

async function handleSupportGuildScopedCommands(bot: CustomBot) {
  const supportGuildScopedCommands = bot.loadedCommands.filter((command) =>
    command.scope === CommandScope.SUPPORT
  );

  await bot.helpers.upsertGuildApplicationCommands(
    bot.config.supportGuildId,
    supportGuildScopedCommands.map((command) =>
      command.discordApplicationCommand
    ),
  );

  bot.logger.info(
    "Successfully upserted support guild scoped commands to the API",
  );
}

async function handleGlobalScopedCommands(bot: CustomBot) {
  const globalScopedCommands = bot.loadedCommands.filter((command) =>
    command.scope === CommandScope.GLOBAL
  );

  await bot.helpers.upsertGlobalApplicationCommands(
    globalScopedCommands.map((command) => command.discordApplicationCommand),
  );

  bot.logger.info("Successfully upserted global scoped commands to the API");
}
