const { Router } = require('express');
const { call } = require('../../helpers/database');

const router = Router();

router.get('/', (req, res, next) => call('public.get_countries').then(data => res.json(data)).catch(next));

module.exports = router;
