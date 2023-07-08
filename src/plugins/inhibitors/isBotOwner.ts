import { createInhibitor } from "internals/loadStuff.ts";

createInhibitor({
  name: "isBotOwner",
  execute: (ctx) => ctx.authorId === ctx.bot.ownerId,
  rejectMessageKey: "INHIBITOR.IS_BOT_OWNER.REJECT",
});
