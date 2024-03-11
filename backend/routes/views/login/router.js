const express = require('express');
const router = express.Router();
const LoginModel = require('./LoginModel.js');
const { updateController } = require('./controllers.js');
const { reqBodyDataIntegrityMiddleware } = require('../ReqbodyValidation.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');

router.route("")
    .put(
        reqBodyDataIntegrityMiddleware(LoginModel.notNullArray),
        schemaValidationMiddleware(LoginModel),
        updateController
    );

module.exports = router;