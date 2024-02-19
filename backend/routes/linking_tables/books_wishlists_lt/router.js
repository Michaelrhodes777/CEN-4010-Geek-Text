const express = require('express');
const router = express.Router();
const BooksWishlistsLTModel = require('./BooksWishlistsLTModel.js');
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
        schemaValidationMiddleware(BooksWishlistsLTModel),
        createController(BooksWishlistsLTModel)
    )
    .get(
        queryStringValidation(BooksWishlistsLTModel, "GET"),
        schemaValidationMiddleware(BooksWishlistsLTModel),
        readController(BooksWishlistsLTModel)
    )
    .put(
        bodyFormatValidationMiddleware,
        queryStringValidation(),
        schemaValidationMiddleware(BooksWishlistsLTModel),
        updateController(BooksWishlistsLTModel)
    )
    .delete(
        queryStringValidation(BooksWishlistsLTModel, "DELETE"),
        schemaValidationMiddleware(BooksWishlistsLTModel), 
        deleteController(BooksWishlistsLTModel)
    );

module.exports = router;