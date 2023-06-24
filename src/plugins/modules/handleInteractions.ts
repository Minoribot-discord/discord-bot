import {
  ApplicationCommandContext,
  BaseCommand,
  Context,
  I18nContext,
  Inhibitor,
  Module,
} from "structures";
import {
  ApplicationCommandOptionTypes,
  Interaction,
  InteractionDataOption,
  InteractionTypes,
} from "deps";
import { CustomBot } from "internals";

export default new Module({
  name: "handleInteractions",

  init: (bot) => {
    const { interactionCreate } = bot.events;

    bot.events.interactionCreate = async (_bot, interaction) => {
      await interactionCreate(_bot, interaction);

      switch (interaction.type) {
        case InteractionTypes.ApplicationCommand:
          await handleApplicationCommand(bot, interaction);
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

  const context = new ApplicationCommandContext(interaction);
  const i18nContext = new I18nContext(interaction);

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

  for (const command of commandsToExecute) {
    await command.execute<ApplicationCommandContext>?.(context, i18nContext);
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
