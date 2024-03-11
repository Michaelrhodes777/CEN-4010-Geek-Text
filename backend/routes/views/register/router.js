const express = require('express');
const router = express.Router();
const RegisterModel = require('./RegisterModel.js');
const { createController } = require('./controllers.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');
const { reqBodyDataIntegrityMiddleware } = require('../ReqBodyValidation.js');

router.route("")
    .post(
        reqBodyDataIntegrityMiddleware(RegisterModel.notNullArray),
        schemaValidationMiddleware(RegisterModel),
        createController(RegisterModel)
    );

module.exports = router;