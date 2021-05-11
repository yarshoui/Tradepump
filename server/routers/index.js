const { Router } = require('express');
const userAPI = require('./v1/user');

const router = Router();

router.use('/v1/user', userAPI);

module.exports = router;
