import passport from 'passport';
import {Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { getJWTKeys } from './jwtConfig';
import { call } from '../helpers/database';

const [jwtPrivateKey, jwtPublicKey] = getJWTKeys();

const opts: StrategyOptions = {
  algorithms: ['RS256'],
  secretOrKey: jwtPublicKey,
  jwtFromRequest: req => {
    if (req && req.cookies) {
      return req.cookies['jwt'];
    }

    return null;
  },
  // TODO:
  // issuer: 'accounts.tradepump.com',
  // audience: 'tradepump.com',
};

export const setupPassport = () => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const data = await call('public.get_user', [jwt_payload.sub]);

      done(null, data);
    } catch (err) {
      done(null, false);
    }
  }));
}

export { jwtPrivateKey };
