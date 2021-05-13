const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const getJWTKeys = require('./jwtConfig');
const { call } = require('../helpers/database');

const [jwtPrivateKey, jwtPublicKey] = getJWTKeys();

const opts = {
  algorithms: ['RS256'],
  secretOrKey: jwtPublicKey,
  // TODO:
  // issuer: 'accounts.tradepump.com',
  // audience: 'tradepump.com',
};

opts.jwtFromRequest = req => {
  if (req && req.cookies) {
    return req.cookies['jwt'];
  }

  return null;
};

const setupPassport = () => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const data = await call('public.get_user', [jwt_payload.sub]);

      done(null, data);
    } catch (err) {
      done(null, false);
    }
  }));
}

module.exports = { setupPassport, jwtPrivateKey };
