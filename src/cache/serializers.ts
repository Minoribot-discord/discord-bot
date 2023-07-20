import {
  DiscordGuild,
  DiscordMember,
  DiscordStageInstance,
  DiscordUser,
  DiscordWelcomeScreenChannel,
  Guild,
  GuildToggles,
  iconBigintToHash,
  Member,
  transformEmojiToDiscordEmoji,
  User,
} from "deps";
import { Serializer } from "./types.ts";
import { customBot } from "bot";
import { customBigintToSnowflake, transformRoleToDiscordRole } from "utils";

export const userSerializer: Serializer<User, DiscordUser> = {
  serialize: (user) => {
    return customBot.transformers.reverse.user(customBot, user);
  },
  deserialize: (discordUser) => {
    return customBot.transformers.user(customBot, discordUser);
  },
};

export const memberSerializer: Serializer<
  Member,
  DiscordMember & { id: string; guild_id: string }
> = {
  serialize: (member) => {
    return {
      ...customBot.transformers.reverse.member(customBot, member),
      id: member.id.toString(),
      guild_id: customBigintToSnowflake(customBot, member.guildId),
    };
  },
  deserialize: (discordMember) => {
    return customBot.transformers.member(
      customBot,
      discordMember,
      discordMember.guild_id,
      discordMember.id,
    );
  },
};

/**
 * Note that we do not pass the channels, members, and voice states.
 *
 * (At least for now)
 *
 * We do pass the roles and the emojis though
 */
export const guildSerializer: Serializer<
  Omit<Guild, "channels"> & {
    channelIds: bigint[];
  },
  (Omit<Omit<Omit<DiscordGuild, "features">, "joined_at">, "channels"> & {
    toggles_bitfield: bigint;
    joined_at_number: number | null;
    shard_id: number;
    channel_ids: string[];
  })
> = {
  serialize: (guild) => {
    return {
      // Custom props
      shard_id: guild.shardId,
      toggles_bitfield: guild.toggles.bitfield,
      joined_at_number: guild.joinedAt ? guild.joinedAt : null,
      channel_ids: guild.channelIds.map((id) =>
        customBot.transformers.reverse.snowflake(id)
      ),

      // DiscordGuild props
      afk_timeout: guild.afkTimeout,
      approximate_member_count: guild.approximateMemberCount,
      approximate_presence_count: guild.approximatePresenceCount,
      default_message_notifications: guild.defaultMessageNotifications,
      description: guild.description ?? null,
      explicit_content_filter: guild.explicitContentFilter,
      max_members: guild.maxMembers,
      max_presences: guild.maxPresences,
      max_video_channel_users: guild.maxVideoChannelUsers,
      max_stage_video_channel_users: guild.maxStageVideoChannelUsers,
      mfa_level: guild.mfaLevel,
      name: guild.name,
      nsfw_level: guild.nsfwLevel,
      preferred_locale: guild.preferredLocale,
      premium_subscription_count: guild.premiumSubscriptionCount,
      premium_tier: guild.premiumTier,
      stage_instances: guild.stageInstances?.map((si) => ({
        id: customBigintToSnowflake(customBot, si.id),
        guild_id: customBigintToSnowflake(customBot, si.guildId),
        channel_id: customBigintToSnowflake(customBot, si.channelId),
        topic: si.topic,
      } as DiscordStageInstance)),
      system_channel_flags: guild.systemChannelFlags,
      vanity_url_code: guild.vanityUrlCode ?? null,
      verification_level: guild.verificationLevel,
      welcome_screen: {
        description: guild.welcomeScreen?.description ?? null,
        welcome_channels: guild.welcomeScreen?.welcomeChannels?.map((wc) => ({
          channel_id: customBigintToSnowflake(customBot, wc.channelId),
          description: wc.description,
          emoji_id: wc.emojiId ?? null
            ? customBigintToSnowflake(customBot, wc.emojiId)
            : null,
          emoji_name: wc.emojiName ?? null,
        } as DiscordWelcomeScreenChannel)) ?? [],
      },
      discovery_splash: guild.discoverySplash
        ? iconBigintToHash(guild.discoverySplash)
        : null,
      member_count: guild.memberCount,
      icon: guild.icon ? iconBigintToHash(guild.icon) : null,
      banner: guild.banner ? iconBigintToHash(guild.banner) : null,
      splash: guild.splash ? iconBigintToHash(guild.splash) : null,
      roles: guild.roles.map((role) =>
        transformRoleToDiscordRole(customBot, role)
      ),
      emojis: guild.emojis?.map((emoji) =>
        transformEmojiToDiscordEmoji(customBot, emoji)
      ),
      id: customBigintToSnowflake(customBot, guild.id),
      owner_id: customBigintToSnowflake(customBot, guild.ownerId),
      permissions: customBigintToSnowflake(customBot, guild.permissions),
      afk_channel_id: guild.afkChannelId
        ? customBigintToSnowflake(customBot, guild.afkChannelId)
        : null,
      widget_channel_id: guild.widgetChannelId
        ? customBigintToSnowflake(customBot, guild.widgetChannelId)
        : null,
      application_id: guild.applicationId
        ? customBigintToSnowflake(customBot, guild.applicationId)
        : null,
      system_channel_id: guild.systemChannelId
        ? customBigintToSnowflake(customBot, guild.systemChannelId)
        : null,
      rules_channel_id: guild.rulesChannelId
        ? customBigintToSnowflake(customBot, guild.rulesChannelId)
        : null,
      public_updates_channel_id: guild.publicUpdatesChannelId
        ? customBigintToSnowflake(customBot, guild.publicUpdatesChannelId)
        : null,
      premium_progress_bar_enabled: guild.premiumProgressBarEnabled,
    };
  },
  deserialize: (customDiscordGuild) => {
    const deserialized = customBot.transformers.guild(customBot, {
      guild: { ...customDiscordGuild, features: [] },
      shardId: customDiscordGuild.shard_id,
    }) as unknown as Omit<Guild, "channels"> & {
      channelIds: bigint[];
    };
    deserialized.channelIds =
      customDiscordGuild.channel_ids.map((id) =>
        customBot.transformers.snowflake(id)
      ) ?? [];
    deserialized.joinedAt = customDiscordGuild.joined_at_number ?? undefined;
    deserialized.toggles = new GuildToggles(
      customDiscordGuild.toggles_bitfield,
    );

    return deserialized;
  },
};

// todo: add channel serializer
