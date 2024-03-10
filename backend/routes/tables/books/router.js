const express = require('express');
const router = express.Router();
const BookModel = require('./BookModel.js');
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
        schemaValidationMiddleware(BookModel), 
        createController(BookModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"),
        schemaValidationMiddleware(BookModel),
        readController(BookModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        tablesQueryStringValidationMiddleware(),
        schemaValidationMiddleware(BookModel),
        updateController(BookModel)
    )
    .delete(
        tablesQueryStringValidationMiddleware("DELETE"),
        schemaValidationMiddleware(BookModel),
        deleteController(BookModel)
    );

module.exports = router;