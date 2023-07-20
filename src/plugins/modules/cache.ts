import { createModule } from "internals/loadStuff.ts";
import { customCache } from "cache/createCache.ts";

createModule({
  name: "cache",
  priority: 1000,
  init: (bot) => {
    const {
      guildCreate,
      guildDelete,
      guildUpdate,
      botUpdate,
      guildMemberUpdate,
      guildMemberRemove,
    } = bot.events;

    bot.events.guildCreate = (guild) => {
      if (!customCache.existingGuilds.has(guild.id)) {
        customCache.existingGuilds.add(guild.id);
      }

      guildCreate?.(guild);
    };

    bot.events.guildUpdate = async (guild) => {
      if (await customCache.guilds.has(guild.id)) {
        await customCache.guilds.set(guild.id, guild);
      }

      guildUpdate?.(guild);
    };

    bot.events.guildDelete = async (id, shardId) => {
      if (await customCache.guilds.has(id)) {
        await customCache.guilds.delete(id);
      }
      if (customCache.existingGuilds.has(id)) {
        customCache.existingGuilds.delete(id);
      }

      guildDelete?.(id, shardId);
    };

    bot.events.botUpdate = async (user) => {
      if (await customCache.users.has(user.id)) {
        await customCache.users.set(user.id, user);
      }

      botUpdate?.(user);
    };

    bot.events.guildMemberUpdate = async (member, user) => {
      const resolvedId = `${member.guildId}${member.id}`;

      if (await customCache.members.has(resolvedId)) {
        await customCache.members.set(resolvedId, member);
      }

      guildMemberUpdate?.(member, user);
    };

    bot.events.guildMemberRemove = async (user, guildId) => {
      const resolvedId = `${guildId}${user.id}`;

      if (await customCache.members.has(resolvedId)) {
        await customCache.members.delete(resolvedId);
      }

      guildMemberRemove?.(user, guildId);
    };

    return bot;
  },
});
