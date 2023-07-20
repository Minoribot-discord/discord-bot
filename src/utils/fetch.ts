import { CustomBot } from "internals";
import { customCache } from "cache";

export async function getOrFetchUser(bot: CustomBot, userId: bigint) {
  let user = await customCache.users.get(userId);

  if (!user) {
    user = await bot.helpers.getUser(userId);
    await customCache.users.set(userId, user);
  }

  return user;
}

export async function getOrFetchGuild(bot: CustomBot, guildId: bigint) {
  let guild = await customCache.guilds.get(guildId);

  if (!guild) {
    guild = await bot.helpers.getGuild(guildId);
    await customCache.guilds.set(guildId, guild);
  }

  return guild;
}

export async function getOrFetchChannel(bot: CustomBot, channelId: bigint) {
  let channel = await customCache.channels.get(channelId);

  if (!channel) {
    channel = await bot.helpers.getChannel(channelId);
    await customCache.channels.set(channelId, channel);
    if (channel.guildId) {
      const guild = await customCache.guilds.get(channel.guildId);
      if (guild) {
        guild.channels.set(
          channelId,
          channel,
        );
        await customCache.guilds.set(channel.guildId, guild);
      }
    }
  }

  return channel;
}

export async function getOrFetchMember(
  bot: CustomBot,
  guildId: bigint,
  memberId: bigint,
) {
  let member = await customCache.members.get(
    `${guildId}${memberId}`,
  );

  if (!member) {
    const guild = await getOrFetchGuild(bot, guildId);
    member = await bot.helpers.getMember(guildId, memberId);

    guild.members.set(memberId, member);
    await customCache.members.set(
      `${guildId}${memberId}`,
      member,
    );
  }

  return member;
}
