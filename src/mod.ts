import { customBot, readStartupCommandLineArgs } from "internals";

// read the args passed to the script at startup and handle them
readStartupCommandLineArgs(customBot);

await (await import("./start.ts")).start();
