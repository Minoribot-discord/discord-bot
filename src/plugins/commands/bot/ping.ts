import { CommandScope } from "structures";
import { createCommand } from "internals/loadStuff.ts";

createCommand({
  name: "ping",
  category: "bot",
  description: "pong",
  scope: CommandScope.GLOBAL,
  dmPermission: true,
  execute: async (ctx) => {
    await ctx.reply("pong");
  },
});
