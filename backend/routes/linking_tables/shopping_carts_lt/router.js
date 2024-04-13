
// Import necessary dependencies
const express = require('express');
const router = express.Router();
const ShoppingCartsLTModel = require('./ShoppingCartsLTModel.js');
// Import middleware for request validation
const bodyFormatValidationMiddleware = require('../../../validation/body_format_validation/bodyFormatValidationMiddleware.js');
const { linkingTablesQueryStringValidationMiddleware: queryStringValidation } = require('../../../validation/query_string_validation/queryStringValidationMiddleware.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');
// Import controller functions for CRUD operations
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

// Define routes for CRUD operations on shopping carts
router.route("/")
    // Route for creating a new shopping cart
    .post(
        // Middleware for validating the format of the request body
        bodyFormatValidationMiddleware,
        // Middleware for validating the schema of the request body
        schemaValidationMiddleware(ShoppingCartsLTModel),
        // Controller function for creating a new shopping cart
        createController(ShoppingCartsLTModel)
    )
    // Route for fetching all shopping carts
    .get(
        // Middleware for validating the query string parameters for fetching
        queryStringValidation(ShoppingCartsLTModel, "GET"),
        // Middleware for validating the schema of the request body
        schemaValidationMiddleware(ShoppingCartsLTModel),
        // Controller function for fetching all shopping carts
        readController(ShoppingCartsLTModel)
    )
    // Route for updating an existing shopping cart
    .put(
        // Middleware for validating the format of the request body
        bodyFormatValidationMiddleware,
        // Middleware for validating the query string parameters for updating
        queryStringValidation(ShoppingCartsLTModel),
        // Middleware for validating the schema of the request body
        schemaValidationMiddleware(ShoppingCartsLTModel),
        // Controller function for updating an existing shopping cart
        updateController(ShoppingCartsLTModel)
    )
    // Route for deleting an existing shopping cart
    .delete(
        // Middleware for validating the query string parameters for deletion
        queryStringValidation(ShoppingCartsLTModel, "DELETE"),
        // Middleware for validating the schema of the request body
        schemaValidationMiddleware(ShoppingCartsLTModel), 
        // Controller function for deleting an existing shopping cart
        deleteController(ShoppingCartsLTModel)
    );

// Export the router for use in other parts of the application
module.exports = router;