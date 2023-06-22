import { Command, CommandScope } from "structures";

export default new Command({
  name: "ping",
  description: "pong",
  scope: CommandScope.GLOBAL,
  dmPermission: true,
  execute: async (ctx) => {
    await ctx.reply("pong");
  },
});
