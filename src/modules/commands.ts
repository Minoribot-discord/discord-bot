import { Module } from "internals/loadModules.ts";
import { CustomBot } from "client";

const commandsModule: Module = {
  name: "commands",
  init: (bot: CustomBot): CustomBot => {
    return bot;
  },
};

export default commandsModule;
