import { Router } from 'express';
import userAPI from './v1/user';
import countriesAPI from './v1/countries';

const router = Router();

router.use('/v1/user', userAPI);
router.use('/v1/countries', countriesAPI);

export default router;
