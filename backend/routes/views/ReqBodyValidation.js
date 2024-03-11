class ErrorInterface extends Error {
    constructor(messageExtension) {
        super(`ErrorInterface: ${messageExtension}`);
        this.isCustomError = true;
        this.customErrorType = "DataIntegrityError(general)";
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

class ReqDoesNotContainBodyError extends ErrorInterface {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super(`req does not have property "body"`);
        this.name = "ReqDoesNotContainBodyError";
        this.mainArgs = errorPayload;
    }
}

class ReqBodyIsNotObjectError extends ErrorInterface {
    static runtimeDataProps = [ "body" ];

    constructor(errorPayload) {
        super(`req.body is not an object or is typeof "array"`);
        this.name = "ReqBodyIsNotObjectError";
        this.mainArgs = errorPayload;
    }
}

class ReqBodyDoesNotHaveRequiredFieldsError extends ErrorInterface {
    static runtimeDataProps = [ "body", "notNullArray", "currentRequiredProp" ];

    constructor(errorPayload) {
        super(`req.body[${errorPayload.currentRequiredProp}] is missing from req.body`);
        this.name = "ReqBodyDoesNotHaveRequiredFieldsError";
        this.mainArgs = errorPayload;
    }
}

const ErrorsTestMap = {
    "ReqDoesNotContainBodyError": ReqDoesNotContainBodyError,
    "ReqBodyIsNotObjectError": ReqBodyIsNotObjectError,
    "ReqBodyDoesNothaveRequiredFieldsError": ReqBodyDoesNotHaveRequiredFieldsError
};

class Logic {
    static validateBody(req) {
        if (!req.hasOwnProperty("body")) {
            throw new ReqDoesNotContainBodyError({});
        }
    }

    static validateBodyDataType(req) {
        if (typeof req.body !== "object" || Array.isArray(req.body)) {
            throw new ReqBodyIsNotObjectError({ "body": JSON.stringify(req.body) });
        }
    }

    static validateReqBodyFields(req, notNullArray) {
        for (let requiredProp of notNullArray) {
            if (!req.body.hasOwnProperty(requiredProp)) {
                throw new ReqBodyDoesNotHaveRequiredFieldsError({
                    "body": JSON.stringify(req.body),
                    "notNullArray": JSON.stringify(notNullArray),
                    "currentRequiredProp": requiredProp
                });
            }
        }
    }
}

function reqBodyDataIntegrityMiddleware(notNullArray = null) {
    return function(req, res, next) {
        Logic.validateBody(req);
        Logic.validateBodyDataType(req);
        if (notNullArray !== null) {
            Logic.validateReqBodyFields(req, notNullArray);
        }
        next();
    }
}

module.exports = {
    ErrorInterface,
    ErrorsTestMap,
    Logic,
    reqBodyDataIntegrityMiddleware
};