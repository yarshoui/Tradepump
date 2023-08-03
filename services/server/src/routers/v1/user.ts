import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { jwtPrivateKey } from '../../config/passport';
import { isAllowed, jwtAuth } from '../../helpers/access';
import { call } from '../../helpers/database';

const router = Router();

// User CRUD
router.get('/profile', isAllowed(), async (req, res, next) => {
  const { id } = req.query;
  const userId = (req.user as any).user_id

  try {
    const data = await call('public.get_user', [id || userId]);

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
// Create user
router.post('/profile', isAllowed(), (req, res) => {
  // TODO: Implement
  throw new Error('Not implemented');
});
// Update user
router.put('/profile', isAllowed(), (req, res) => {
  // TODO: Implement
  throw new Error('Not implemented');
});
// Delete user
router.delete('/profile', isAllowed(), (req, res) => {
  // TODO: Implement
  throw new Error('Not implemented');
});


// Authorization logic
router.get('/login', jwtAuth(), (req, res) => {
  res.status(200).json(req.user);
});

router.post('/login', async (req, res, next) => {
  // TODO: normal auth with db
  const { login, password } = req.body;
  let user;
  try {
    user = await call('public.auth', [login, password]);
  } catch (err) {
    next(err);
    return;
  }
  const token = jwt.sign({ sub: user.user_id, name: user.user_name }, jwtPrivateKey, { algorithm: 'RS256' });

  res.cookie('jwt', token, { httpOnly: true });
  res.status(200).json(user);
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'OK' });
});

export default router;
