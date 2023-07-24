import { createInhibitor } from "internals/loadStuff.ts";

createInhibitor({
  name: "isBotOwner",
  execute: (ctx) => ctx.authorId === ctx.bot.ownerId,
});
