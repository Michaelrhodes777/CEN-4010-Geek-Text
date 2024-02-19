class BodyFormatError extends Error {
    static thisMapper(build, thisInstantiation) {
        for (let key of Object.keys(build)) {
            thisInstantiation[key] = build[key];
        }
    }

    constructor(message, errorPayload) {
        super("BodyFormatError: " + message);
        this.isCustomError = true;
        this.customErrorType = "BodyFormatError";
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

        QueryStringValidationError.thisMapper(build, this);
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

class ReqBodyDoesNotExistError extends BodyFormatError {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super("req does not have the property body", errorPayload);
        this.name = "ReqBodyDoesNotExistError";
    }
}

class ReqBodyIsNotArrayError extends BodyFormatError {

    static runtimeDataProps = [ "body" ];

    constructor(errorPayload) {
        super("req.body is an array", errorPayload);
        this.name = "ReqBodyIsNotArrayError";
    }

}

class ReqBodyLengthIsZeroError extends BodyFormatError {
    static runtimeDataProps = [ "body" ];

    constructor(errorPayload) {
        super("req.body.length === 0", errorPayload);
        this.name = "NoIterationArrayInDataIteratorError";
    }
}

const ErrorsTestMap = {
    "ReqBodyDoesNotExistError": ReqBodyDoesNotExistError,
    "ReqBodyIsNotArrayError": ReqBodyIsNotArrayError,
    "ReqBodyLengthIsZeroError": ReqBodyLengthIsZeroError
};

module.exports = {
    BodyFormatError,
    ErrorPayload,
    ReqBodyDoesNotExistError,
    ReqBodyIsNotArrayError,
    ReqBodyLengthIsZeroError,
    ErrorsTestMap
};