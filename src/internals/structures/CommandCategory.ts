import { Command } from "internals";

export interface CommandCategoryParams {
  name: string;
  description?: string;
}
export class CommandCategory {
  name: string;
  description = "";
  commands: Command[] = [];
  /** If created via the createCommand function, will be set to true.
   *
   *  If set to true, that means you can then use the createCommandCategory function on it and it will not throw an error.
   */
  mutable = false;

  constructor(params: CommandCategoryParams) {
    this.name = params.name;

    if (params.description) this.description = params.description;
  }
}
