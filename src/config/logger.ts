import { createLogger, transports, format } from 'winston';

//TODO: Cloudwatch to be implemented
const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(), 
          format.printf(({ level, message, timestamp }) => {
                return `[${level}] : ${timestamp} ${message}`; // log format
        })
        )
      }),
    ],
  });

export default logger;