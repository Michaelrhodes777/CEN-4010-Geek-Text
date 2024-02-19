const express = require('express');
const router = express.Router();
const PublisherModel = require('./PublisherModel.js');
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
        schemaValidationMiddleware(PublisherModel), 
        createController(PublisherModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"), 
        readController(PublisherModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        tablesQueryStringValidationMiddleware(),
        schemaValidationMiddleware(PublisherModel),
        updateController(PublisherModel)
    )
    .delete(
        tablesQueryStringValidationMiddleware("DELETE"),
        deleteController(PublisherModel)
    );
module.exports = router;