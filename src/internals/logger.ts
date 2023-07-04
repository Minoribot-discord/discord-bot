import { fs, log } from "deps";
import { formatDate } from "utils";

const logDirectory = "logs";

await fs.ensureDir(`./${logDirectory}`);

const generateFileName = () => {
  return `./${logDirectory}/log_${formatDate(new Date())}.txt`;
};

const fileHandler = new log.handlers.FileHandler("DEBUG", {
  filename: generateFileName(),

  formatter: ({ levelName, msg, datetime }) =>
    `[${formatDate(datetime, " | ")}] - ${levelName} ${msg}`,
});

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: "{levelName} {msg}",
    }),
    file: fileHandler,
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },
  },
});

const logger = log.getLogger();

const flushFn = () => {
  fileHandler.flush();
};
setInterval(flushFn, 2 * 1000);

globalThis.addEventListener("unload", () => {
  console.log("fileHandler flushed");
  fileHandler.flush();
});

export { logger };
