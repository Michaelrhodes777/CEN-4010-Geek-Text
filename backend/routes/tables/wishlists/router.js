const express = require('express');
const router = express.Router();
const WishlistModel = require('./WishlistModel.js');
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
        schemaValidationMiddleware(WishlistModel), 
        createController(WishlistModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"), 
        readController(WishlistModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        tablesQueryStringValidationMiddleware(),
        schemaValidationMiddleware(WishlistModel),
        updateController(WishlistModel)
    )
    .delete(
        tablesQueryStringValidationMiddleware("DELETE"),
        deleteController(WishlistModel)
    );

module.exports = router;