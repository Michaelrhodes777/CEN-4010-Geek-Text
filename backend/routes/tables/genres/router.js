const express = require('express');
const router = express.Router();
const GenreModel = require('./GenreModel.js');
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
        schemaValidationMiddleware(GenreModel),
        createController(GenreModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"), 
        readController(GenreModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        tablesQueryStringValidationMiddleware(),
        schemaValidationMiddleware(GenreModel),
        updateController(GenreModel)
    )
    .delete(
        tablesQueryStringValidationMiddleware("DELETE"),
        deleteController(GenreModel)
    );

module.exports = router;