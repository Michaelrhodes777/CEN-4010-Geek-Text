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
const verifyJWTMiddleware = require('../../../middleware/authorization/verify_jwt/verifyJWTMiddleware');
const verifyRolesMiddleware = require('../../../middleware/authorization/verify_roles/verifyRolesMiddleware');


router.route("/")
    .post(
        verifyJWTMiddleware, // JWT token validation
        verifyRolesMiddleware('ADMIN'), // Role verification for 'ADMIN'
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