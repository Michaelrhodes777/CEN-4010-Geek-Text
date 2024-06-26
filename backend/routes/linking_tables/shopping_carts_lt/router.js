const express = require('express');
const router = express.Router();
const ShoppingCartsLTModel = require('./ShoppingCartsLTModel.js');
const bodyFormatValidationMiddleware = require('../../../validation/body_format_validation/bodyFormatValidationMiddleware.js');
const { linkingTablesQueryStringValidationMiddleware: queryStringValidation } = require('../../../validation/query_string_validation/queryStringValidationMiddleware.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(
        bodyFormatValidationMiddleware,
        schemaValidationMiddleware(ShoppingCartsLTModel),
        createController(ShoppingCartsLTModel)
    )
    .get(
        queryStringValidation(ShoppingCartsLTModel, "GET"),
        schemaValidationMiddleware(ShoppingCartsLTModel),
        readController(ShoppingCartsLTModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        queryStringValidation(ShoppingCartsLTModel),
        schemaValidationMiddleware(ShoppingCartsLTModel),
        updateController(ShoppingCartsLTModel)
    )
    .delete(
        queryStringValidation(ShoppingCartsLTModel, "DELETE"),
        schemaValidationMiddleware(ShoppingCartsLTModel), 
        deleteController(ShoppingCartsLTModel)
    );

module.exports = router;