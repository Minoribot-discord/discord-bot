import { CustomBot } from "internals/client.ts";
import upsertCommandsSubmodule from "./upsertCommands.ts";

export default async function handleReadySubmodules(bot: CustomBot) {
  await upsertCommandsSubmodule(bot);
}
