import { Member } from "deps";
import { createInhibitor } from "internals/loadStuff.ts";
import { getOrFetchMember, hasGuildPermissions, highestRole } from "utils";

createInhibitor({
  name: "isTargetMemberEditable",
  execute: async (ctx) => {
    const targetMemberId_ = ctx.args.getString("user") ||
      ctx.args.getString("member");
    if (!targetMemberId_) {
      throw new Error("No user id provided in command");
    }
    const targetMemberId: bigint = ctx.bot.transformers.snowflake(
      targetMemberId_,
    );

    const guild = await ctx.getGuild();

    /*
      Will try to get the member from the cache, or fetch it from Discord.
      If it throws an error because the resource doesn't exist,
      (aka the member is probably not on the server)
      it will just return true and validate the inhibitor
      Maybe we'll change this behaviour in the future
    */
    let targetMember: Member | undefined;
    try {
      targetMember = await getOrFetchMember(
        ctx.bot,
        ctx.guildId!,
        targetMemberId,
      );
    } catch (e_) {
      const error = e_ as unknown;

      if (
        error && (error instanceof Error) && ("message" in error) &&
        (typeof error.message === "string") &&
        (error.message.includes(
          "10007",
        ))
      ) {
        ctx.bot.logger.error(error);
        return true;
      } else {
        throw error;
      }
    }

    const authorMember = await ctx.getAuthorMember();

    if (hasGuildPermissions(guild, targetMember, ["ADMINISTRATOR"])) {
      return false;
    }
    if (targetMemberId === guild.ownerId) {
      return false;
    }

    const highestRoleTargetMember = highestRole(guild, targetMember);
    const highestRoleAuthorMember = highestRole(guild, authorMember);

    if (
      highestRoleTargetMember.position >= highestRoleAuthorMember.position
    ) {
      return false;
    }

    return true;
  },
});
