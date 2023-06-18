import winston from 'winston';
import envVars from './env-vars.js';
const { format, transports } = winston;

// { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }
const formatParams = ({ timestamp, level, message, ...args }) => {
  const ts = timestamp.slice(0, 19).replace('T', ' ');
  const logArgs = Object.keys(args).length ? JSON.stringify(args, '', '') : '';

  return `${ts} ${level}: ${message} ${logArgs}`;
};

const Format = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams),
);

const transportArray =
  envVars.env === 'production'
    ? [new transports.File({ filename: 'error.log', level: 'error' })]
    : [new transports.Console()];

const logger = winston.createLogger({
  level: envVars.Level,
  format: Format,
  transports: transportArray,
});

export default logger;

