import { Router } from 'express';
import { usersAPI } from './v1/user';
import { countriesAPI } from './v1/countries';

export const router = Router();

router.use('/v1/user', usersAPI);
router.use('/v1/countries', countriesAPI);
