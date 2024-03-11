const express = require('express');
const router = express.Router();
const { RefreshTokenValidation } = require('../RefreshTokenValidation.js');
const { validateRefreshTokenIntregrityMiddleware } = RefreshTokenValidation;
const { readController } = require('./controllers.js');

router.route("")
    .put(validateRefreshTokenIntregrityMiddleware, readController);

module.exports = router;