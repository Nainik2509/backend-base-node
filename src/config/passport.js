import { ExtractJwt, Strategy } from 'passport-jwt';
import User from '../api/models/user.js';
import envVars from './env-vars.js';

const JwtOptions = {
  secretOrKey: envVars.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const JWT = async (payload, done) => {
  try {
    var condition = {
      $and: [
        {
          _id: payload.sub,
        },
        {
          status: payload.status,
        },
      ],
    };
    const user = await User.findOne(condition);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
};

export const JwtStr = new Strategy(JwtOptions, JWT);

