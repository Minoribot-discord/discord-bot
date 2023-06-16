import { CustomBot } from "internals";

type InitFunc = (bot: CustomBot) => CustomBot | Promise<CustomBot>;

interface ModuleParams {
  name: string;
  priority?: number;
  init: InitFunc;
}

class Module {
  name: string;
  priority = 0;

  init: InitFunc;

  constructor(params: ModuleParams) {
    const { name, priority, init } = params;

    this.name = name;
    if (priority) {
      this.priority = priority;
    }
    this.init = init.bind(this) || ((bot: CustomBot) => {
      return bot;
    });
  }
}

export { Module };
export type { ModuleParams };
