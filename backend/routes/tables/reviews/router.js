const express = require('express');
const router = express.Router();
const ReviewModel = require('./ReviewModel.js');
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
        schemaValidationMiddleware(ReviewModel), 
        createController(ReviewModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"), 
        readController(ReviewModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        tablesQueryStringValidationMiddleware(),
        schemaValidationMiddleware(ReviewModel),
        updateController(ReviewModel)
    )
    .delete(
        tablesQueryStringValidationMiddleware("DELETE"),
        deleteController(ReviewModel)
    );

module.exports = router;