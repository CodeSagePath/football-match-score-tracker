import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
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
