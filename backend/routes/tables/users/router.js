const express = require('express');
const router = express.Router();
const UserModel = require('./UserModel.js');
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
        schemaValidationMiddleware(UserModel), 
        createController(UserModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"),
        schemaValidationMiddleware(UserModel),
        readController(UserModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        tablesQueryStringValidationMiddleware(),
        schemaValidationMiddleware(UserModel),
        updateController(UserModel)
    )
    .delete(
        tablesQueryStringValidationMiddleware("DELETE"),
        schemaValidationMiddleware(UserModel),
        deleteController(UserModel)
    );

module.exports = router;