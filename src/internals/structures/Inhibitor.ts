import { Context, I18nContext, LocaleKeys } from "internals";
import { camelCaseToScreamingSnakeCase } from "utils";

export type InhibitorExecuteFunc = (
  context: Context,
) => boolean | Promise<boolean>;

export interface InhibitorParams {
  name: string;
  execute: InhibitorExecuteFunc;
}

export class Inhibitor {
  name: string;
  rejectMessageKey: LocaleKeys | string;

  execute: InhibitorExecuteFunc;

  constructor(params: InhibitorParams) {
    const { name, execute } = params;

    this.name = name;
    this.execute = execute.bind(this) ||
      ((_context: Context) => {
        return false;
      });

    this.rejectMessageKey = `INHIBITOR.${
      camelCaseToScreamingSnakeCase(this.name)
    }.REJECT`;
  }

  rejectMessage(i18n: I18nContext): string {
    // Even if the key is actually the inhibitor's name, it won't throw an error
    // It'll just return the key instead
    return i18n.translate(this.rejectMessageKey as LocaleKeys);
  }
}
