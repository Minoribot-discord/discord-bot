import { createModule } from "internals/loadStuff.ts";

createModule({
  name: "customizers",
  priority: 1000,
  init: (bot) => {
    bot.transformers.desiredProperties = {
      attachment: {
        id: true,
        filename: true,
        contentType: true,
        size: true,
        url: true,
        proxyUrl: true,
        height: true,
        width: true,
        ephemeral: true,
        description: true,
      },
      channel: {
        type: true,
        position: true,
        name: true,
        topic: true,
        nsfw: true,
        bitrate: true,
        userLimit: true,
        rateLimitPerUser: true,
        rtcRegion: true,
        videoQualityMode: true,
        guildId: true,
        lastPinTimestamp: true,
        permissionOverwrites: true,
        id: true,
        permissions: true,
        lastMessageId: true,
        ownerId: true,
        applicationId: true,
        managed: true,
        parentId: true,
        memberCount: true,
        messageCount: true,
        archiveTimestamp: true,
        autoArchiveDuration: true,
        botIsMember: true,
        archived: true,
        locked: true,
        invitable: true,
        createTimestamp: true,
        newlyCreated: true,
        flags: true,
      },
      emoji: {
        id: true,
        name: true,
        roles: true,
        user: true,
      },
      guild: {
        afkTimeout: true,
        approximateMemberCount: true,
        approximatePresenceCount: true,
        defaultMessageNotifications: true,
        description: true,
        explicitContentFilter: true,
        maxMembers: true,
        maxPresences: true,
        maxVideoChannelUsers: true,
        mfaLevel: true,
        name: true,
        nsfwLevel: true,
        preferredLocale: true,
        premiumSubscriptionCount: true,
        premiumTier: true,
        stageInstances: true,
        systemChannelFlags: true,
        vanityUrlCode: true,
        verificationLevel: true,
        welcomeScreen: true,
        discoverySplash: true,
        joinedAt: true,
        memberCount: true,
        shardId: true,
        icon: true,
        banner: true,
        splash: true,
        id: true,
        ownerId: true,
        permissions: true,
        afkChannelId: true,
        widgetChannelId: true,
        applicationId: true,
        systemChannelId: true,
        rulesChannelId: true,
        publicUpdatesChannelId: true,
        premiumProgressBarEnabled: true,
      },
      interaction: {
        id: true,
        applicationId: true,
        type: true,
        guildId: true,
        channelId: true,
        member: true,
        user: true,
        token: true,
        version: true,
        message: true,
        data: true,
        locale: true,
        guildLocale: true,
        appPermissions: true,
      },
      invite: {
        channelId: true,
        code: true,
        createdAt: true,
        guildId: true,
        inviter: true,
        maxAge: true,
        maxUses: true,
        targetType: true,
        targetUser: true,
        targetApplication: true,
        temporary: true,
        uses: true,
      },
      member: {
        id: true,
        guildId: true,
        user: true,
        nick: true,
        roles: true,
        joinedAt: true,
        premiumSince: true,
        avatar: true,
        permissions: true,
        communicationDisabledUntil: true,
        deaf: true,
        mute: true,
        pending: true,
      },
      message: {
        activity: true,
        application: true,
        applicationId: true,
        attachments: true,
        author: true,
        channelId: true,
        components: true,
        content: true,
        editedTimestamp: true,
        embeds: true,
        guildId: true,
        id: true,
        interaction: {
          id: true,
          member: true,
          name: true,
          type: true,
          user: true,
        },
        member: true,
        mentionedChannelIds: true,
        mentionedRoleIds: true,
        mentions: true,
        messageReference: {
          messageId: true,
          channelId: true,
          guildId: true,
        },
        nonce: true,
        reactions: true,
        stickerItems: true,
        thread: true,
        type: true,
        webhookId: true,
      },
      role: {
        name: true,
        guildId: true,
        position: true,
        color: true,
        id: true,
        botId: true,
        integrationId: true,
        permissions: true,
        icon: true,
        unicodeEmoji: true,
        mentionable: true,
        hoist: true,
        managed: true,
        subscriptionListingId: true,
      },
      scheduledEvent: {
        id: true,
        guildId: true,
        channelId: true,
        creatorId: true,
        scheduledStartTime: true,
        scheduledEndTime: true,
        entityId: true,
        creator: true,
        name: true,
        description: true,
        privacyLevel: true,
        status: true,
        entityType: true,
        userCount: true,
        location: true,
        image: true,
      },
      stageInstance: {
        id: true,
        guildId: true,
        channelId: true,
        topic: true,
        guildScheduledEventId: true,
      },
      sticker: {
        id: true,
        packId: true,
        name: true,
        description: true,
        tags: true,
        type: true,
        formatType: true,
        available: true,
        guildId: true,
        user: true,
        sortValue: true,
      },
      user: {
        username: true,
        globalName: true,
        locale: true,
        flags: true,
        premiumType: true,
        publicFlags: true,
        accentColor: true,
        id: true,
        discriminator: true,
        avatar: true,
        bot: true,
        system: true,
        mfaEnabled: true,
        verified: true,
        email: true,
        banner: true,
      },
      webhook: {
        id: true,
        type: true,
        guildId: true,
        channelId: true,
        user: true,
        name: true,
        avatar: true,
        token: true,
        applicationId: true,
        sourceGuild: true,
        sourceChannel: true,
        url: true,
      },
    };

    return bot;
  },
});
