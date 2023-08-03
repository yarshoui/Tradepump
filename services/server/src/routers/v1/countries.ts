import { Router } from 'express';
import { call } from '../../helpers/database';

const router = Router();

router.get('/', (req, res, next) =>
    call('public.get_countries').then(data => res.json(data)).catch(next));

export default router;