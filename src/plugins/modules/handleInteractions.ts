import {
  ApplicationCommandOptionTypes,
  Interaction,
  InteractionDataOption,
  InteractionTypes,
  PermissionStrings,
} from "deps";
import { BaseCommand, Context, I18nContext, Inhibitor } from "structures";
import { getMissingChannelPermissions } from "utils";
import { createModule } from "internals/loadStuff.ts";
import { CustomBot } from "internals/CustomBot.ts";

createModule({
  name: "handleInteractions",

  init: (bot) => {
    const { interactionCreate } = bot.events;

    bot.events.interactionCreate = (interaction) => {
      interactionCreate?.(interaction);

      switch (interaction.type) {
        case InteractionTypes.ApplicationCommand:
          handleApplicationCommand(bot, interaction)
            .catch((error) =>
              handleApplicationCommandError(bot, interaction, error)
            ).catch(bot.logger.error);
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

  const context = new Context(bot, interaction);
  const i18nContext = await (new I18nContext(bot, interaction)).initLocale();

  const invalidInhibitors = await checkInhibitors(
    commandsToExecute,
    context,
  );
  if (invalidInhibitors.length > 0) {
    context.reply(
      i18nContext.translate(
        "INHIBITOR.MISSING_CONDITIONS",
        [
          `\n\`${
            invalidInhibitors.map((inhibitor) =>
              inhibitor.rejectMessage(i18nContext)
            ).join(
              "\`, \`",
            )
          }\``,
        ],
      ),
      { isPrivate: true },
    );
    return;
  }

  const allRequiredBotPermissions = calculateAllRequiredBotPermissions(
    commandsToExecute,
  );
  const missingBotPermissions = await checkRequiredBotPermissions(
    allRequiredBotPermissions,
    context,
  );
  if (missingBotPermissions.length > 0) {
    context.reply(
      i18nContext.translate(
        "COMMAND.GLOBAL.MISSING_PERMISSIONS",
        [
          `\n\`${missingBotPermissions.join("\`, \`")}\``,
        ],
      ),
      { isPrivate: true },
    );
    return;
  }

  for (const command of commandsToExecute) {
    await command.execute?.(context, i18nContext);
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
  ctx: Context,
): Promise<Inhibitor[]> {
  const invalidInhibitors: Inhibitor[] = [];

  for (const command of commandsToExecute) {
    for (const inhibitor of command.inhibitors) {
      if (!(await inhibitor.execute(ctx))) {
        invalidInhibitors.push(inhibitor);
      }
    }
  }

  return invalidInhibitors;
}

function calculateAllRequiredBotPermissions(
  commandsToExecute: BaseCommand[],
): PermissionStrings[] {
  const allRequiredBotPermissions: PermissionStrings[] = [];
  for (const command of commandsToExecute) {
    for (const permission of command.requiredBotPermissions) {
      if (!allRequiredBotPermissions.includes(permission)) {
        allRequiredBotPermissions.push(permission);
      }
    }
  }

  return allRequiredBotPermissions;
}
/**
 * Returns
 */
async function checkRequiredBotPermissions(
  allRequiredBotPermissions: PermissionStrings[],
  ctx: Context,
): Promise<PermissionStrings[]> {
  const botMember = await ctx.getBotMember();

  return getMissingChannelPermissions(
    await ctx.getGuild(),
    await ctx.getChannel(),
    botMember,
    allRequiredBotPermissions,
  );
}

// deno-lint-ignore require-await
async function handleApplicationCommandError(
  bot: CustomBot,
  _interaction: Interaction,
  error: unknown,
) {
  // const context = new ApplicationCommandContext(bot, interaction);
  // const i18nContext = await (new I18nContext(bot, interaction)).initLocale();

  bot.logger.error(error);
}
