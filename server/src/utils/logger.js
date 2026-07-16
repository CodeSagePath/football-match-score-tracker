import winston from "winston";

const istFormat = new Intl.DateTimeFormat("en-ZA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => istFormat.format(new Date()).replace(/\//g, "-").replace(",", "")
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const logMessage = stack || message;
      return `${timestamp} [${level.toUpperCase()}]: ${logMessage}`;
    })
  ),
  defaultMeta: { service: "football-score-tracker" },
  transports: [
    // Logs errors to error.log
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB limit
      maxFiles: 5,
    }),
    // Logs everything to combined.log
    new winston.transports.File({
      filename: "./logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// Logs to console in development
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

export default logger;
