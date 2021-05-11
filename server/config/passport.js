const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const getJWTKeys = require('./jwtConfig');

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
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // TODO: Implement database auth
    if (jwt_payload.sub == 123) {
      done(null, { id: +jwt_payload.sub, name: jwt_payload.name });
    } else {
      done(null, false);
    }
  }));
}

module.exports = { setupPassport, jwtPrivateKey };
