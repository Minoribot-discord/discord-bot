import { AllowedMentionsTypes, ExecuteWebhook } from "deps";
import { CustomBot } from "internals/CustomBot.ts";
import { WebhookIdAndToken } from "zod_schemas";
import { makeBaseErrorEmbed } from "utils";
import { EmbedBuilder } from "structures";

export function sendWebhook(
  bot: CustomBot,
  webhook: WebhookIdAndToken,
  options: ExecuteWebhook,
) {
  if (!("token" in webhook)) throw new Error("Webhook token is required");

  return bot.helpers.executeWebhook(webhook.id, webhook.token!, options);
}

export async function sendErrorWebhook(
  bot: CustomBot,
  error: Error | string | EmbedBuilder,
) {
  if (!("error" in bot.config.webhooks)) {
    bot.logger.warn("Error thrown, but no error webhook configured");
    return;
  }

  if (error instanceof Error || typeof error === "string") {
    error = makeBaseErrorEmbed(error);
  }

  return await sendWebhook(bot, bot.config.webhooks.error, {
    allowedMentions: {
      parse: [AllowedMentionsTypes.UserMentions],
    },
    content: `<@${bot.ownerId}>`,
    embeds: [
      error.toDiscordEmbed(bot),
    ],
  });
}
