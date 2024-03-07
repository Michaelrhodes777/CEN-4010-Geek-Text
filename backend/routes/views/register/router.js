const express = require('express');
const router = express.Router();
const RegisterModel = require('./RegisterModel.js');
const { createController } = require('./controllers.js');
const schemaValidationMiddleware = require('../../../validation/schema_validation/schemaValidationMiddleware.js');

class DataIntegrityError extends Error {
    constructor(messageExtension) {
        super(`DataIntegrityError: ${messageExtension}`);
        this.isCustomError = true;
        this.customErrorType = "DataIntegrityError(register route)";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = null;
        this.auxArgs = null;
        this.name = null;
        this.iterationIndex = null;
        this.controllerType = null;
        this.loggingPayload = null;
        this.name = null;
    }
}

class ReqDoesNotContainBodyError extends DataIntegrityError {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super(`req does not have property "body"`);
        this.name = "ReqDoesNotContainBodyError";
        this.mainArgs = errorPayload;
    }
}

class ReqBodyIsNotObjectError extends DataIntegrityError {
    static runtimeDataProps = [ "body" ];

    constructor(errorPayload) {
        super(`req.body is not an object or is typeof "array"`);
        this.name = "ReqBodyIsNotObjectError";
        this.mainArgs = errorPayload;
    }
}

class ReqBodyDoesNotHaveRequiredFieldsError extends DataIntegrityError {
    static runtimeDataProps = [ "body", "notNullArray", "currentRequiredProp" ];

    constructor(errorPayload) {
        super(`req.body[${errorPayload.currentRequiredProp}] is missing from req.body`);
        this.name = "ReqBodyDoesNotHaveRequiredFieldsError";
        this.mainArgs = errorPayload;
    }
}

function dataIntegrityMiddleware(notNullArray) {
    return function(req, res, next) {
        if (!req.hasOwnProperty("body")) {
            throw new ReqDoesNotContainBodyError({});
        }
        if (typeof req.body !== "object" || Array.isArray(req.body)) {
            throw new ReqBodyIsNotObjectError({ "body": JSON.stringify(req.body) });
        }
        for (let requiredProp of notNullArray) {
            if (!req.body.hasOwnProperty()) {
                throw new ReqBodyDoesNotHaveRequiredFieldsError({
                    "body": JSON.stringify(req.body),
                    "notNullArray": JSON.stringify(notNullArray),
                    "currentRequiredProp": requiredProp
                });
            }
        }
        next();
    }
}

router.route("")
    .post(dataIntegrityMiddleware(RegisterModel.notNullArray), schemaValidationMiddleware(RegisterModel), createController(RegisterModel));

module.exports = router;