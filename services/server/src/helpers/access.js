const passport = require('passport');
const { call } = require('./database');

const jwtAuth = () => passport.authenticate('jwt', { session: false, failWithError: true });

const isAllowed = (defaultOperationName) => (req, res, next) =>
  passport.authenticate('jwt', { session: false, failWithError: true })(req, res, err => {
    if (err) return next(err);
    const operationName = defaultOperationName ||
      // e.g. 'get.user' or 'post.user'
      `${req.method.toLowerCase()}.${req.originalUrl
          .toLowerCase()
          .replace(/^\/api\/v[1-9]\/|\?.*$/g, '')
          .replace(/\//g, '.')}`;

    call('access.check', [1, operationName])
      .then(() => next())
      .catch(next);
  });

module.exports = { isAllowed, jwtAuth };
