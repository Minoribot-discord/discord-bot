import { CustomBot } from "internals";

async function getOrFetchUser(bot: CustomBot, userId: bigint) {
  let user = bot.users.get(userId);

  if (!user) {
    user = await bot.helpers.getUser(userId);
    bot.users.set(userId, user);
  }

  return user;
}

async function getOrFetchGuild(bot: CustomBot, guildId: bigint) {
  let guild = bot.guilds.get(guildId);

  if (!guild) {
    guild = await bot.helpers.getGuild(guildId);
    bot.guilds.set(guildId, guild);
  }

  return guild;
}

async function getOrFetchChannel(bot: CustomBot, channelId: bigint) {
  let channel = bot.channels.get(channelId);

  if (!channel) {
    channel = await bot.helpers.getChannel(channelId);
    bot.channels.set(channelId, channel);
  }

  return channel;
}

async function getOrFetchMember(
  bot: CustomBot,
  guildId: bigint,
  memberId: bigint,
) {
  let member = bot.members.get(
    bot.transformers.snowflake(`${guildId}${memberId}`),
  );

  if (!member) {
    const guild = await getOrFetchGuild(bot, guildId);
    member = await bot.helpers.getMember(guildId, memberId);

    guild.members.set(memberId, member);
    bot.members.set(
      bot.transformers.snowflake(`${guildId}${memberId}`),
      member,
    );
  }

  return member;
}

export { getOrFetchChannel, getOrFetchGuild, getOrFetchMember, getOrFetchUser };
