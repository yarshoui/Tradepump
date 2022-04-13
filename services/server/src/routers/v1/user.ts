import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { QueueManager } from '../../../../commons/src/QueueManager';
import { jwtPrivateKey } from '../../config/passport';
import { isAllowed, jwtAuth } from '../../helpers/access';
import { call } from '../../helpers/database';
import { EmailTemplateManager } from '../../helpers/EmailTemplateManager';

export const usersAPI = Router();

// User CRUD
usersAPI.get('/profile', isAllowed(), async (req, res, next) => {
  const { id } = req.query;

  try {
    const data = await call('public.get_user', [id || req.user?.user_id]);

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// Create user
usersAPI.post('/profile', isAllowed(), (req, res) => {
  // TODO: Implement
  throw new Error('Not implemented');
});

// Update user
usersAPI.put('/profile', isAllowed(), (req, res) => {
  // TODO: Implement
  throw new Error('Not implemented');
});

// Delete user
usersAPI.delete('/profile', isAllowed(), (req, res) => {
  // TODO: Implement
  throw new Error('Not implemented');
});

// Registration
usersAPI.post('/register', async (req, res) => {
  const { email, password } = req.body;
  // - ReCaptcha validate
  // - Validate an email
  // + create account in db and get user id
  // + generate token for user id
  // - create task to send activation link with token to the email
  const user = await call('public.create_user', [email, password]) as UserModel;
  const token = await call('private.generate_token', [user.user_id]) as string;
  // Send email registration
  const registrationEmail = EmailTemplateManager.getTemplate('registration_email', {
    token,
    user_name: user.user_name,
  });
  QueueManager.sendToQueue('email_queue', Buffer.from(registrationEmail));

  res.status(200).json(user);
});

// Authorization logic
usersAPI.get('/login', jwtAuth(), (req, res) => {
  res.status(200).json(req.user);
});

usersAPI.post('/login', async (req, res, next) => {
  const { login, password } = req.body;
  const user = await call('public.auth', [login, password]);
  const token = jwt.sign({ sub: user.user_id, name: user.user_name }, jwtPrivateKey, { algorithm: 'RS256' });

  res.cookie('jwt', token, { httpOnly: true });
  res.status(200).json(user);
});

usersAPI.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'OK' });
});
