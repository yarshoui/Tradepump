import { Router } from 'express';
import { call } from '../../helpers/database';

export const countriesAPI = Router();

countriesAPI.get('/', (_req, res, next) => call('public.get_countries').then(data => res.json(data)).catch(next));
