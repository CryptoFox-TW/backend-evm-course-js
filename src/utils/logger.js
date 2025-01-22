const { createLogger, format, transports } = require('winston');
const winston = require('winston');
require('winston-daily-rotate-file');

// Create a logger
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [
    // Daily rotate file transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/trading-bot-api-service-%DATE%.log', // Set the log file name and date format
      datePattern: 'YYYY-MM-DD', // Generate a new log file daily
      zippedArchive: true, // Compress old log files
      maxSize: '20m', // Maximum size for each log file
      maxFiles: '14d', // Retain log files for the last 14 days
    }),
    // // Console output
    // new transports.Console({
    //   format: format.combine(format.colorize(), format.simple()),
    // }),
  ],
});

module.exports = logger;
