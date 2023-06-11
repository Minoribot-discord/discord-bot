import { hasGuildPermissions } from "deps";
import { Inhibitor } from "classes";

export default new Inhibitor({
  name: "isAuthorAdmin",
  execute: async (context) => {
    const bot = context.bot;
    return hasGuildPermissions(
      bot,
      await context.guild,
      await context.authorMember,
      ["ADMINISTRATOR"],
    );
  },
});
