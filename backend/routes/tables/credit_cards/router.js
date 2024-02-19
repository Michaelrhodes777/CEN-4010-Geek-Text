const express = require('express');
const router = express.Router();
const CreditCardModel = require('./CreditCardModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');
const bodyFormatValidationMiddleware = require('../../../validation/body_format_validation/bodyFormatValidationMiddleware.js');
const { tablesQueryStringValidationMiddleware } = require('../../../validation/query_string_validation/queryStringValidationMiddleware.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');

router.route("/")
    .post(
        bodyFormatValidationMiddleware, 
        schemaValidationMiddleware(CreditCardModel), 
        createController(CreditCardModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"),
        readController(CreditCardModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        tablesQueryStringValidationMiddleware(),
        schemaValidationMiddleware(CreditCardModel),
        updateController(CreditCardModel)
    )
    .delete(
        tablesQueryStringValidationMiddleware("DELETE"),
        deleteController(CreditCardModel)
    );
module.exports = router;