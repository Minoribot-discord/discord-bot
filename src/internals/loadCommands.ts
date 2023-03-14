import { CustomBot } from "./client.ts";

interface Command {
  name: string;
  description: string;
}
type LoadedCommand =
  & Command
  & {
    category: string;
  };

interface CmdCategory {
  name: string;
  description: string;
  commands: LoadedCommand[];
}

async function loadCommands(bot: CustomBot) {
}

export { loadCommands };
export type { CmdCategory, Command };
