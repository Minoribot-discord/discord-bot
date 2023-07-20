import { BigString, DiscordRoleTags, iconBigintToHash, Role } from "deps";
import { CustomBot } from "internals/CustomBot.ts";
import { CustomDiscordRole } from "structures";

export function customBigintToSnowflake(
  bot: CustomBot,
  snowflake: BigString | undefined,
): string | undefined {
  if (snowflake === null || snowflake === undefined) return undefined;

  return bot.transformers.reverse.snowflake(snowflake);
}

export function transformRoleToDiscordRole(
  bot: CustomBot,
  role: Role,
): CustomDiscordRole {
  return {
    // Custom props
    guild_id: bot.transformers.reverse.snowflake(role.guildId),

    // DiscordRole props
    id: bot.transformers.reverse.snowflake(role.id),
    name: role.name,
    position: role.position,
    color: role.color,
    permissions: role.permissions.toJSON(),
    icon: role.icon ? iconBigintToHash(role.icon) : undefined,
    unicode_emoji: role.unicodeEmoji,
    managed: role.managed,
    hoist: role.hoist,
    mentionable: role.mentionable,
    tags: transformRoleTagsToDiscordRoleTags(bot, role.tags),
  };
}

export function transformRoleTagsToDiscordRoleTags(
  bot: CustomBot,
  tags: Role["tags"],
): DiscordRoleTags | undefined {
  if (!tags) return undefined;
  return {
    bot_id: tags.botId
      ? bot.transformers.reverse.snowflake(tags.botId)
      : undefined,
    integration_id: tags.integrationId
      ? bot.transformers.reverse.snowflake(tags.integrationId)
      : undefined,
    subscription_listing_id: tags.subscriptionListingId
      ? tags.subscriptionListingId.toString()
      : undefined,
    available_for_purchase: tags.availableForPurchase ? null : undefined,
    guild_connections: tags.guildConnections ? null : undefined,
    premium_subscriber: tags.premiumSubscriber ? null : undefined,
  };
}
