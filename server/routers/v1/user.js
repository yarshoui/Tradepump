const { Router } = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { jwtPrivateKey } = require('../../config/passport');

const router = Router();

router.get('/login', passport.authenticate('jwt', { session: false, failWithError: true }), (req, res) => {
  res.status(200).json(req.user);
});

router.post('/login', (req, res) => {
  // TODO: normal auth with db
  const { login, password } = req.body;

  if (login !== 'admin' || password !== 'admin') {
    res.status(400).json({ error: 'Incorrect login or password' });
    return;
  }
  const user = { id: 123, name: 'Test user' };
  const token = jwt.sign({ sub: user.id, name: user.name }, jwtPrivateKey, { algorithm: 'RS256' });

  res.cookie('jwt', token, { httpOnly: true });
  res.status(200).json(user);
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'OK' });
});

module.exports = router;
