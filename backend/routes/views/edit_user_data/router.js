const express = require('express');
const router = express.Router();
const EditUserDataModel = require('./EditUserDataModel.js');
const { updateController } = require('./controllers.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');
const { reqBodyDataIntegrityMiddleware } = require('../ReqbodyValidation.js');
const { validateDataIntegrityMiddleware } = require('./CustomValidation.js').CustomValidation;

router.route("")
    .put(
        reqBodyDataIntegrityMiddleware(null),
        validateDataIntegrityMiddleware(EditUserDataModel), 
        schemaValidationMiddleware(EditUserDataModel),
        updateController(EditUserDataModel)
    );

module.exports = router;