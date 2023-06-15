import { Context } from "./Context.ts";

type InhibitorExecuteFunc = (context: Context) => boolean | Promise<boolean>;

interface InhibitorParams {
  name: string;
  execute: InhibitorExecuteFunc;
  // errorMessageKey: string;
}
class Inhibitor {
  name: string;
  errorMessageKey = "";

  execute: InhibitorExecuteFunc;

  constructor(params: InhibitorParams) {
    const { name, execute } = params;

    this.name = name;
    this.execute = execute.bind(this) || ((_context: Context) => {
      return false;
    });
  }

  errorMessage() {
    return this.name;
  }
}

export { Inhibitor };
