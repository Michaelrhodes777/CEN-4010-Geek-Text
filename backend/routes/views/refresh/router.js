const express = require('express');
const router = express.Router();
const { RefreshTokenValidation } = require('../RefreshTokenValidation.js');
const { validateDataIntegrityMiddleware } = RefreshTokenValidation;
const { readController } = require('./controllers.js');

router.route("")
    .put(validateDataIntegrityMiddleware, readController);

module.exports = router;