import passport from 'passport';
import { call } from './database';
import { NextFunction, Request, Response } from 'express';

export const jwtAuth = () => passport.authenticate('jwt', { session: false, failWithError: true });

export const isAllowed = (defaultOperationName?: string) => (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate('jwt', { session: false, failWithError: true })(req, res, (err: any) => {
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
