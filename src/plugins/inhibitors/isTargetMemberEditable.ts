import { hasGuildPermissions, highestRole } from "deps";
import { createInhibitor } from "internals/loadStuff.ts";
import { getOrFetchMember } from "utils";

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

    const guild = await ctx.guild;
    const targetMember = await getOrFetchMember(
      ctx.bot,
      ctx.guildId!,
      targetMemberId,
    );
    const authorMember = await ctx.authorMember;

    if (hasGuildPermissions(ctx.bot, guild, targetMember, ["ADMINISTRATOR"])) {
      return false;
    }
    if (targetMemberId === guild.ownerId) {
      return false;
    }

    const highestRoleTargetMember = highestRole(ctx.bot, guild, targetMember);
    const highestRoleAuthorMember = highestRole(ctx.bot, guild, authorMember);

    if (
      highestRoleTargetMember.position >= highestRoleAuthorMember.position
    ) {
      return false;
    }

    return true;
  },
});
