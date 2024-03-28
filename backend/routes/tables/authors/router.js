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
const verifyJWTMiddleware = require('../../../middleware/authorization/verify_jwt/verifyJWTMiddleware');
const verifyRolesMiddleware = require('../../../middleware/authorization/verify_roles/verifyRolesMiddleware');

router.route("/")
    .post(
        verifyJWTMiddleware, // JWT token validation
        verifyRolesMiddleware('ADMIN'), // Role verification for 'ADMIN'
        bodyFormatValidationMiddleware, 
        schemaValidationMiddleware(AuthorModel), 
        createController(AuthorModel)
    )
    .get(
        tablesQueryStringValidationMiddleware("GET"),
        schemaValidationMiddleware(AuthorModel),
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
        schemaValidationMiddleware(AuthorModel),
        deleteController(AuthorModel)
    );

module.exports = router;