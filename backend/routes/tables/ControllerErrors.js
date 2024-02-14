class ControllerError extends Error {

    static thisMapper(build, thisInstantiation) {
        for (let key of Object.keys(build)) {
            thisInstantiation[key] = build[key];
        }
    }

    constructor(message, errorPayload) {
        super(message);

        const build = {
            ...errorPayload.mainArgs,
            auxiliaryArgs: errorPayload.auxiliaryArgs,
            currentIndexOfReqBody: errorPayload.currentIndexOfReqBody,
            isCustomError: true,
            name: null,// needs to be implemented by child classes
            statusCode: 400,
            userResponse: "Bad request",
            controllerType: null,
            loggingPayload: null
        };

        ControllerError.thisMapper(build, this);
    }

    addControllerType(type) {
        this.controllerType = type;
    }

    getStatusCode() {
        return this.statusCode;
    }

    getUserResponse() {
        return this.userResponse;
    }

    getResponseObject() {
        return {
            "response": this.userResponse
        };
    }

    buildLoggingPayload() {
        if (this.runtimeDataPropsRef === null) {
            return `runtimDataPropsRef was never instantiated by child class ${this.name === null ? "null" : this.name}`;
        }
        if (this.name === null) {
            return `name was never instantiated by child class`;
        }
        if (this.controllerType === null) {

        }

        let build = `Controller Type: ${this.controllerType} ${this.name}\n${this.message}\n`;
        for (let propName of runtimeDataPropsRef) {
            build += `\t${propName}: ${this[propName]}\n`;
        }
    }

    getLoggingPayload() {
        return this.loggingPayload === null ? "loggingPayload is null. Run method buildLoggingPayload()\n" : this.loggingPayload;
    }
}

class ErrorPayload {

    static _append(runtimeObject, propName) {
        runtimeObject[propName] = runtimeObject;
    }

    constructor() {
        this.mainArgs = null;
        this.auxiliaryArgs = {
            indexOfIteration: null
        };
    }

    appendMainArgs(runtimeObject) {
        this.mainArgs = runtimeObject;
    }

}

// ASYNC Errors

class IdArrayHasZeroLengthError extends ControllerError {
    static runtimeProps = [];

    constructor(errorPayload) {
        super("ASYNC: dataIterator() recieved idArray of zero length", errorPayload);
        this.name = "IdArrayHasZeroLengthError";
        this.responseMessage = "Malformed Data / runtime error";
    }
}

class AllQueryAndBodyError extends ControllerError {
    static runtimeProps = [ "idArray", "body" ];

    constructor(errorPayload) {
        super("ASYNC: dataIterator() recieved an id=[0] all query and a non-null body", errorPayload);
        this.name = "AllQueryAndBodyError";
        this.responseMessage = "Malformed Data / runtime error";
    }
}

class InvalidPrimaryKeyError extends ControllerError {

    static runtimeDataProps = [ "primaryKey", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("ASYNC: Database failed to validate primary key", errorPayload);
        this.name = "InvalidPrimaryKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class InvalidForeignKeyError extends ControllerError {

    static runtimeDataProps = [ "foreignKey", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("ASYNC: Database failed to validate foreign key existence", errorPayload);
        this.name = "InvalidForeignKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class UniquenessError extends ControllerError {

    static runtimeDataProps = [ "columnName", "queryString", "valuesArray", "responseRows" ];

    constructor(errorPayload) {
        super("ASYNC: Database failed to validate field uniqueness", errorPayload);
        this.name = "UniquenessError";
        this.statusCode = 409;
        this.responseMessage = "Conflicting resources";
    }
}

// SYNC Errors

class ReqDoesNotHaveQueryPropError extends ControllerError {
    static runtimeDataProps = [ "req" ];

    constructor(errorPayload) {
        super("SYNC: req does not have query property", errorPayload);
        this.name = "ReqDoesNotHaveQueryPropError";
        this.response = "Malformed data";
    }
}

class ReqQueryDoesNotHaveIdPropError extends ControllerError {
    static runtimeDataProps = [ "req" ];

    constructor(errorPayload) {
        super("SYNC: req.query does not have id property", errorPayload);
        this.name = "ReqQueryDoesNotHaveIdPropError";
        this.response = "Malformed data";
    }
}

class ReqQueryIdIsNotArrayStringFormatError extends ControllerError {
    static runtimeDataProps = [ "id" ];
    
    constructor(errorPayload) {
        super("SYNC: req.query.id does not start and close with brackets or has no ids", errorPayload);
        this.name = "ReqQueryIdIsNotArrayStringFormatError";
        this.response = "Malformed data";
    }
}

class ReqQueryIdIsNotArrayError extends ControllerError {
    static runtimeDataProps = [ "req" ];

    constructor(errorPayload) {
        super("SYNC: req.query.id is not an array", errorPayload);
        this.name = "ReqQueryIdIsNotArrayError";
        this.response = "Malformed data";
    }
}

class ReqQueryArrayElementNaNError extends ControllerError {
    static runtimeDataProps = [ "query", "id" ];

    constructor(errorPayload) {
        super("SYNC: req.query.id has elements === NaN", errorPayload);
        this.name = "ReqQueryArrayElementNaNError";
        this.response = "MalformedData";
    }

}

class ReqQueryArrayElementIsNotIntegerError extends ControllerError {
    static runtimeDataProps = [ "query", "id", "parsed" ];

    constructor(errorPayload) {
        super("SYNC: req.query.id has element that is not an integer", errorPayload);
        this.name = "ReqQueryArrayElementIsNotIntegerError";
        this.response = "Malformed data";
    }

}

class MultipleAllQueriesError extends ControllerError {
    static runtimeDataProps = [ "id" ];
    
    constructor(errorPayload) {
        super("SYNC: id has multiple zeros", errorPayload);
        this.name = "MultipleAllQueriesError";
        this.response = "Malformed data";
    }
}

class ReqBodyDoesNotExistError extends ControllerError {
    static runtimeDataProps = [ "req" ];

    constructor(errorPayload) {
        super("SYNC: req does not have the property body", errorPayload);
        this.name = "ReqBodyDoesNotExistError";
        this.response = "Malformed data";
    }
}

class ReqBodyIsNotArrayError extends ControllerError {

    static runtimeDataProps = [ "body" ];

    constructor(errorPayload) {
        super("SYNC: req.body is not an array and therefore cannot be iterated over to generate queries in the controller", errorPayload);
        this.name = "ReqBodyIsNotArrayError";
        this.response = "Malformed data";
    }

}

class NoIterationArrayInDataIteratorError extends ControllerError {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super("SYNC: req.body DNE and idArray === null. dataIterator() needs an array to iterate over", errorPayload);
        this.name = "NoIterationArrayInDataIteratorError";
        this.response = "Malformed data || runtime error"
    }
}

class IterationArraysHaveUnequalLengthError extends ControllerError {
    static runtimeDataProps = [ "idArray", "body" ];

    constructor(errorPayload) {
        super("SYNC: idArray.length !== body.length in dataIterator()", errorPayload);
        this.name = "IterationArraysHaveUnequalLengthError";
        this.response = "Malformed data || runtime error";
    }
}

class MissingQueryStringPropError extends ControllerError {

    static runtimeDataProps = [ "requiredProp", "queryStringObject" ];

    constructor(errorPayload) {
        super("SYNC: req.query is missing required property", errorPayload);
        this.name = "MissingQueryStringPropError";
    }

}

class MissingRequiredFieldError extends ControllerError {

    static runtimeDataProps = [ "notNullArray", "requestData", "requiredField" ];

    constructor(errorPayload) {
        super("SYNC: requestData does not have the required fields", errorPayload);
        this.name = "MissingRequiredFieldError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidRequiredFieldError extends ControllerError {

    static runtimeDataProps = [ "notNullArray", "requestData", "requiredField", "current" ];

    constructor(errorPayload) {
        super("SYNC: request data field is malformed", errorPayload);
        this.name = "InvalidRequiredFieldError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidJsTypeError extends ControllerError {

    static runtimeDataProps = [ "expectedType", "actualType" ];

    constructor(errorPayload) {
        super("SYNC: request data field is malformed", errorPayload);
        this.name = "InvalidJsTypeError";
        this.responseMessage = "Malformed data";
    }
}

class IntNumberBoundsError extends ControllerError {

    static runtimeDataProps = [ "bounds", "data" ];

    constructor(errorPayload) {
        super("SYNC: integer database data type is not within proper constraints", errorPayload);
        this.name = "IntNumberBoundsError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidVarcharLengthError extends ControllerError {

    static runtimeDataProps = [ "bounds", "data" ];

    constructor(errorPayload) {
        super("SYNC: varchar database data type is not within proper constraints", errorPayload);
        this.name = "InvalidVarcharLengthError";
        this.responseMessage = "Malformed data";
    }
}

class BlacklistError extends ControllerError {

    static runtimeDataProps = [ "blacklist", "data" ];

    constructor(errorPayload) {
        super("SYNC: data includes blacklisted elements", errorPayload);
        this.name = "BlackListError";
        this.responseMessage = "Malformed data";
    }
}

class WhitelistError extends ControllerError {

    static runtimeDataProps = [ "blacklist", "data", "constraintFailures" ];

    constructor(errorPayload) {
        super("SYNC: data includes blacklisted elements", errorPayload);
        this.name = "WhitelistError";
        this.responseMessage = "Malformed data";
    }
}

class RequiredListError extends ControllerError {

    static runTimeDataProps = [ "lists", "index", "data" ];
    
    constructor(errorPayload) {
        super("SYNC: data does not contain atleast one element from each list", errorPayload);
        this.name = "RequiredListError";
        this.responseMessage = "Malformed data";
    }
}

class SwitchFallThroughRuntimeError extends Error {
    constructor(message, obj) {
        super(message);
        this.name = "SwitchFallThroughRuntimeError";
        this.auxiliaries = JSON.stringify(obj);
    }
}

module.exports = {
    ErrorPayload,
    ReqDoesNotHaveQueryPropError,
    ReqQueryDoesNotHaveIdPropError,
    ReqQueryIdIsNotArrayStringFormatError,
    ReqQueryIdIsNotArrayError,
    ReqQueryArrayElementNaNError,
    ReqQueryArrayElementIsNotIntegerError,
    MultipleAllQueriesError,
    ReqBodyDoesNotExistError,
    ReqBodyIsNotArrayError,
    NoIterationArrayInDataIteratorError,
    IterationArraysHaveUnequalLengthError,
    MissingQueryStringPropError,
    MissingRequiredFieldError,
    InvalidRequiredFieldError,
    InvalidJsTypeError,
    IntNumberBoundsError,
    InvalidVarcharLengthError,
    BlacklistError,
    WhitelistError,
    IdArrayHasZeroLengthError,
    AllQueryAndBodyError,
    InvalidPrimaryKeyError,
    InvalidForeignKeyError,
    RequiredListError,
    UniquenessError,
    SwitchFallThroughRuntimeError
};