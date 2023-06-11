import { Context } from "./Context.ts";

interface InhibitorParams {
  name: string;
  execute: (context: Context) => boolean | Promise<boolean>;
  // errorMessageKey: string;
}
class Inhibitor {
  name: string;
  errorMessageKey = "";

  // deno-lint-ignore no-unused-vars
  execute(context: Context): boolean | Promise<boolean> {
    return false;
  }

  constructor(params: InhibitorParams) {
    const { name, execute } = params;

    this.name = name;
    this.execute = execute;
  }
}

export { Inhibitor };
