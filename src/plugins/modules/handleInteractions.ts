import {
  ApplicationCommandContext,
  BaseCommand,
  Context,
  I18nContext,
  Inhibitor,
} from "structures";
import {
  ApplicationCommandOptionTypes,
  Interaction,
  InteractionDataOption,
  InteractionTypes,
} from "deps";
import { createModule } from "internals/loadStuff.ts";
import { CustomBot } from "internals/CustomBot.ts";

createModule({
  name: "handleInteractions",

  init: (bot) => {
    const { interactionCreate } = bot.events;

    bot.events.interactionCreate = (_bot, interaction) => {
      interactionCreate(_bot, interaction);

      switch (interaction.type) {
        case InteractionTypes.ApplicationCommand:
          handleApplicationCommand(bot, interaction);
      }
    };

    return bot;
  },
});

async function handleApplicationCommand(
  bot: CustomBot,
  interaction: Interaction,
) {
  const data = interaction.data;
  if (!data) return;
  const mainCommand = bot.commands.get(interaction.data!.name);
  if (!mainCommand) return;

  const commandsToExecute: BaseCommand[] = [mainCommand];

  if (
    data.options?.[0]?.type ===
      ApplicationCommandOptionTypes.SubCommandGroup ||
    data.options?.[0]?.type ===
      ApplicationCommandOptionTypes.SubCommand
  ) {
    checkForSubCommands(
      bot,
      commandsToExecute,
      data.options![0],
      mainCommand.name,
    );
  }

  const context = new ApplicationCommandContext(bot, interaction);
  const i18nContext = await (new I18nContext(bot, interaction)).initLocale();

  const invalidInhibitors = await checkInhibitors(
    commandsToExecute,
    context,
  );

  if (invalidInhibitors.length > 0) {
    context.reply(
      `**Command not authorized, missing conditions**:\n\`${
        invalidInhibitors.map((inhibitor) => inhibitor.errorMessage()).join(
          "\`, \`",
        )
      }\``,
    );
    return;
  }

  try {
    for (const command of commandsToExecute) {
      await command.execute<ApplicationCommandContext>?.(context, i18nContext);
    }
  } catch (e) {
    bot.logger.error(e);
  }
}

function checkForSubCommands(
  bot: CustomBot,
  commandsToExecute: BaseCommand[],
  option: InteractionDataOption,
  getCommandString: string,
) {
  getCommandString = `${getCommandString}/${option.name}`;

  const subCommandOrGroup = bot.subCommands.get(
    getCommandString,
  );
  if (!subCommandOrGroup) {
    throw new Error(
      `Sub command or sub command group couldn't be found: ${getCommandString}`,
    );
  }
  commandsToExecute.push(subCommandOrGroup);

  if (
    option.options?.[0]?.type ===
      ApplicationCommandOptionTypes.SubCommand
  ) {
    checkForSubCommands(
      bot,
      commandsToExecute,
      option.options[0],
      getCommandString,
    );
  }
}

async function checkInhibitors(
  commandsToExecute: BaseCommand[],
  context: Context,
): Promise<Inhibitor[]> {
  const invalidInhibitors: Inhibitor[] = [];

  for (const command of commandsToExecute) {
    for (const inhibitor of command.inhibitors) {
      if (!(await inhibitor.execute(context))) {
        invalidInhibitors.push(inhibitor);
      }
    }
  }

  return invalidInhibitors;
}
