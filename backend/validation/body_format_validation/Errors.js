const TestingPayload = require('../TestingPayload.js');

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

class ReqBodyDoesNotExistError extends BodyFormatError {
    static runtimeDataProps = [];

    static testPointsOfFailure = [
        new TestingPayload(
            "given that req does not have body property, test should fail",
            "validateReqBodyStructure",
            [ {} ]
        )
    ];

    constructor(errorPayload) {
        super("req does not have the property body", errorPayload);
        this.name = "ReqBodyDoesNotExistError";
    }
}

class ReqBodyIsNotArrayError extends BodyFormatError {

    static runtimeDataProps = [ "body" ];

    static testPointsOfFailure = [
        new TestingPayload(
            "given that req.body is null, test should fail",
            "validateReqBodyStructure",
            [ { req: null } ]
        ),
        new TestingPayload(
            "given that req.body is an object, test should fail",
            "validateReqBodyStructure",
            [ { req: {} } ]
        ),
        new TestingPayload(
            "given that req.body is undefined, test should fail",
            "validateReqBodyStructure",
            [ { req: undefined } ]
        )
    ]

    constructor(errorPayload) {
        super("req.body is an array", errorPayload);
        this.name = "ReqBodyIsNotArrayError";
    }

}

class ReqBodyLengthIsZeroError extends BodyFormatError {
    static runtimeDataProps = [ "body" ];

    static testPointsOfFailure = [
        new TestingPayload(
            "given that req.body is array of length zero, test should fail",
            "validateReqBodyStructure",
            [ { req: [] } ]
        )
    ]

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
    ReqBodyDoesNotExistError,
    ReqBodyIsNotArrayError,
    ReqBodyLengthIsZeroError,
    ErrorsTestMap
};