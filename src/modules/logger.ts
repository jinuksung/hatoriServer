import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import moment from "moment-timezone";

const logDir = `logs`;

const { combine, timestamp, printf } = winston.format;

const koreanTimeStamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment().tz(opts.tz).format("YYYY-MM-DD HH:mm:ss ||");
  }
  return info;
});

//winston log level
//error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6

const format = combine(
  koreanTimeStamp({ tz: "Asia/Seoul" }),
  printf((info) => `${info.timestamp} ${info.level} | ${info.message}`)
);

const transport: DailyRotateFile = new DailyRotateFile({
  filename: `${logDir}/%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
});

export const logger = winston.createLogger({
  format,
  transports: [
    new winston.transports.DailyRotateFile({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`,
      handleExceptions: true,
    }),
    new winston.transports.DailyRotateFile({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error",
      filename: `%DATE%.error.log`,
    }),
    // new winston.transports.Console({ handleExceptions: true }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
