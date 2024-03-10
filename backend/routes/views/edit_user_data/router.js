const express = require('express');
const router = express.Router();
const EditUserDataModel = require('./EditUserDataModel.js');
const { updateController } = require('./controllers.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');

router.route("")
    .put(schemaValidationMiddleware(EditUserDataModel), updateController(EditUserDataModel));

module.exports = router;