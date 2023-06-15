import { readStartupCommandLineArgs } from "internals/cli.ts";
import { customBot } from "internals/client.ts";

// read the args passed to the script at startup and handle them
readStartupCommandLineArgs(customBot);

await (await import("./start.ts")).start();
