const { Router } = require('express');
const userAPI = require('./v1/user');
const countriesAPI = require('./v1/countries');

const router = Router();

router.use('/v1/user', userAPI);
router.use('/v1/countries', countriesAPI);

module.exports = router;
