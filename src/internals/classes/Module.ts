import { CustomBot } from "../CustomBotType.ts";

interface ModuleParams {
  name: string;
  priority?: number;
  init: (bot: CustomBot) => CustomBot | Promise<CustomBot>;
}

class Module {
  name: string;
  priority = 0;

  init(bot: CustomBot): CustomBot | Promise<CustomBot> {
    return bot;
  }

  constructor(params: ModuleParams) {
    const { name, priority, init } = params;

    this.name = name;
    if (priority) {
      this.priority = priority;
    }
    if (init) {
      this.init = init;
    }
  }
}

export { Module };
export type { ModuleParams };
