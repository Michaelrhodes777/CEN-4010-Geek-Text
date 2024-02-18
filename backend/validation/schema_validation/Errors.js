class SchemaValidationError extends Error {
    static thisMapper(build, thisInstantiation) {
        for (let key of Object.keys(build)) {
            thisInstantiation[key] = build[key];
        }
    }

    constructor(message, errorPayload) {
        super("SchemaValidationError: " + message);
        this.isCustomError = true;
        this.customErrorType = "SchemaValidationError";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = null;
        this.auxArgs = null;
        this.name = null;
        this.iterationIndex = null;
        this.controllerType = null;
        this.loggingPayload = null;
        this.name = null;

        const build = {
            mainArgs: errorPayload.mainArgs,
        };

        SchemaValidationError.thisMapper(build, this);
    }
}

class ErrorPayload {

    constructor() {
        this.mainArgs = null;
    }

    appendMainArgs(runtimeObject) {
        this.mainArgs = runtimeObject;
    }

}

class MissingRequiredFieldError extends SchemaValidationError {

    static runtimeDataProps = [ "notNullArray", "requestData", "requiredField" ];

    constructor(errorPayload) {
        super("requestData does not have the required fields", errorPayload);
        this.name = "MissingRequiredFieldError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidRequiredFieldError extends SchemaValidationError {

    static runtimeDataProps = [ "notNullArray", "requestData", "requiredField", "current" ];

    constructor(errorPayload) {
        super("request data field is malformed", errorPayload);
        this.name = "InvalidRequiredFieldError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidJsTypeError extends SchemaValidationError {

    static runtimeDataProps = [ "expectedType", "actualType" ];

    constructor(errorPayload) {
        super("request data field is malformed", errorPayload);
        this.name = "InvalidJsTypeError";
        this.responseMessage = "Malformed data";
    }
}

class IntNumberBoundsError extends SchemaValidationError {

    static runtimeDataProps = [ "bounds", "data" ];

    constructor(errorPayload) {
        super("integer database data type is not within proper constraints", errorPayload);
        this.name = "IntNumberBoundsError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidVarcharLengthError extends SchemaValidationError {

    static runtimeDataProps = [ "bounds", "data" ];

    constructor(errorPayload) {
        super("varchar database data type is not within proper constraints", errorPayload);
        this.name = "InvalidVarcharLengthError";
        this.responseMessage = "Malformed data";
    }
}

class BlacklistError extends SchemaValidationError {

    static runtimeDataProps = [ "blacklist", "data" ];

    constructor(errorPayload) {
        super("data includes blacklisted elements", errorPayload);
        this.name = "BlacklistError";
        this.responseMessage = "Malformed data";
    }
}

class WhitelistError extends SchemaValidationError {

    static runtimeDataProps = [ "blacklist", "data", "constraintFailures" ];

    constructor(errorPayload) {
        super("data includes blacklisted elements", errorPayload);
        this.name = "WhitelistError";
        this.responseMessage = "Malformed data";
    }
}

class RequiredListError extends SchemaValidationError {

    static runTimeDataProps = [ "lists", "index", "data" ];
    
    constructor(errorPayload) {
        super("data does not contain atleast one element from each list", errorPayload);
        this.name = "RequiredListError";
        this.responseMessage = "Malformed data";
    }
}

const ErrorsTestMap = {
    "MissingRequiredFieldError": MissingRequiredFieldError,
    "InvalidRequiredFieldError": InvalidRequiredFieldError,
    "InvalidJsTypeError": InvalidJsTypeError,
    "IntNumberBoundsError": IntNumberBoundsError,
    "InvalidVarcharLengthError": InvalidVarcharLengthError,
    "BlacklistError": BlacklistError,
    "WhitelistError": WhitelistError,
    "RequiredListError": RequiredListError
};

module.exports = {
    SchemaValidationError,
    ErrorPayload,
    MissingRequiredFieldError,
    InvalidRequiredFieldError,
    InvalidJsTypeError,
    IntNumberBoundsError,
    InvalidVarcharLengthError,
    BlacklistError,
    WhitelistError,
    RequiredListError,
    ErrorsTestMap
};