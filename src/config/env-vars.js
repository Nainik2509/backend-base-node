import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MorganProd = {
  skip(req, res) {
    return res.statusCode <= 400;
  },
  stream: fs.createWriteStream(path.join(__dirname, '../../access.log'), {
    flags: 'a',
  }),
};

const envVars = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  morganConfig: process.env.NODE_ENV === 'production' ? MorganProd : {},
  Level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  mongo: {
    uri:
      process.env.NODE_ENV === 'development'
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI,
    options: {
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // moscaPort: process.env.MOSCA_PORT,
  // rateLimitTime: process.env.RATE_LIMIT_TIME,
  // rateLimitRequest: process.env.RATE_LIMIT_REQUEST,
  // saltRound: process.env.NODE_ENV === 'development' ? 5 : 10,
  // redisPort: process.env.REDIS_PORT,
  // redisHost: process.env.REDIS_HOST,
};

export default envVars;

