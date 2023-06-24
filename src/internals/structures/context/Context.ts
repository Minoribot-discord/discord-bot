import { Message } from "deps";

interface Context {
  // deno-lint-ignore no-explicit-any
  reply: (...args: any[]) => Promise<Message | undefined>;
}

export type { Context };
