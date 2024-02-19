const express = require('express');
const router = express.Router();
const AuthorModel = require('./AuthorModel.js');
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
        schemaValidationMiddleware(AuthorModel), 
        createController(AuthorModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"),
        readController(AuthorModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        tablesQueryStringValidationMiddleware(),
        schemaValidationMiddleware(AuthorModel),
        updateController(AuthorModel)
    )
    .delete(
        tablesQueryStringValidationMiddleware("DELETE"),
        deleteController(AuthorModel)
    );

module.exports = router;