import { CustomBot } from "internals/CustomBot.ts";

export type TaskExecuteFunc = (bot: CustomBot) => void | Promise<void>;

// Code ripped of from "https://github.com/AmethystFramework/framework/blob/3d2d53df210c9af368ee2ad0677d7452241ed8ab/src/interfaces/tasks.ts"
export interface Task {
  name: string;

  interval: number;
  execute: TaskExecuteFunc;
}

export interface RunningTasks {
  initialTimeouts: number[];
  intervals: number[];
}
