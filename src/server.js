import chalk from 'chalk';
import dotenv from 'dotenv';
import http from 'http';
import envVars from './config/env-vars.js';
import app from './config/express.js';
import logger from './config/logger.js';
import DatabaseConnect from './config/mongoose.js';

dotenv.config();

const server = http.createServer(app);

server.listen(envVars.port);

server.on('listening', () => {
  DatabaseConnect();
  // RunCronJobs();
  logger.info(
    `We're flying on ${chalk.greenBright(
      `${envVars.env.toUpperCase()}_${envVars.port}`,
    )}`,
  );
});

// Unhandled Exceptions/Rejections
['uncaughtException', 'unhandledRejection'].forEach((signal) =>
  process.on(signal, (error) => {
    logger.info(chalk.redBright(`💥 ${signal} !...`));
    logger.info(chalk.redBright(`${error.name}, ${error.message}`));
  }),
);

// Termination Signals
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
  process.on(signal, () => {
    logger.info(`💥 ${signal} RECEIVED`);
  }),
);

// Server Error handler
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind =
    typeof envVars.port === 'string'
      ? `Pipe ${envVars.port}`
      : `envVars.Port ${envVars.port}`;
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
};

server.on('error', onError);

export default server;

