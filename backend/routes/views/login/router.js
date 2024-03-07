const express = require('express');
const router = express.Router();
const { LoginModel } = require('./LoginModel.js');
const { updateController } = require('./controllers.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');

router.route("")
    .put(schemaValidationMiddleware(LoginModel), updateController);

module.exports = router;