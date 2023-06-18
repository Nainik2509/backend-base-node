import mongoose from 'mongoose';
import envVars from './env-vars.js';
import logger from './logger.js';

mongoose.Promise = global.Promise;

// Set Mongoose options dynamically from the object
// Object.entries(envVars.mongo.setOption).forEach(([option, value]) => {
//   mongoose.set(option, value);
// });

mongoose.connection.on('error', (err) => {
  console.log(err);
  logger.error(`Mongo Engine is down : ${err}`);
});

mongoose.connection.on('connected', () => {
  logger.info(`Main Engine is up on ${envVars.env}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  logger.info(`MongoDb disconnected - ${envVars.env}`);
  // Implement reconnection logic if desired
});
const DatabaseConnect = () => {
  mongoose.connect(envVars.mongo.uri, envVars.mongo.options);
  return mongoose.connection;
};

export default DatabaseConnect;
