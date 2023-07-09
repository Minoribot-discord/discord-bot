import { createInhibitor } from "internals/loadStuff.ts";

createInhibitor({
  name: "isBotOwner",
  rejectMessageKey: "INHIBITOR.IS_BOT_OWNER.REJECT",
  execute: (ctx) => ctx.authorId === ctx.bot.ownerId,
});
