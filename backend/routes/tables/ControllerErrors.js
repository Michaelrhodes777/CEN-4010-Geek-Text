class ControllerError extends Error {
    constructor(message) {
        super(message);
        this.isCustomError = true;
        this.name = null; // needs to be implemented by child classes
        this.statusCode = 400;
        this.userResponse = "Bad request";
        this.runtimeDataPropsRef = null; // needs to be implemented by child classes
        this.controllerType = null;
        this.loggingPayload = null;
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

// ASYNC Errors

class InvalidPrimaryKeyError extends ControllerError {

    static runtimeDataProps = [ "primaryKey", "queryText", "queryValues", "responseRows" ];

    constructor(primaryKey, queryText, queryValues, responseRows) {
        super("ASYNC: Database failed to validate primary key");
        this.name = "InvalidPrimaryKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";

        this.primaryKey = primaryKey;
        this.queryText = queryText;
        this.queryValues = queryValues
        this.responseRows = responseRows;
        this.runtimeDataPropsRef = InvalidPrimaryKeyError.runtimeDataProps;
    }
}

class UniquenessError extends ControllerError {

    static runtimeDataProps = [ "columnName", "queryString", "valuesArray", "data", "responseRows" ];

    constructor(columnName, queryString, valuesArray, data, responseRows) {
        super("ASYNC: Database failed to validate field uniqueness");
        this.name = "UniquenessError";
        this.statusCode = 409;
        this.responseMessage = "Conflicting resources";

        this.columnName = columnName;
        this.queryString = queryString;
        this.valuesArray = valuesArray;
        this.data = data;
        this.responseRows = responseRows;
        this.runtimeDataPropsRef = UniquenessError.runtimeDataProps;
    }
}

// SYNC Errors

class MissingQueryStringPropError extends ControllerError {

    static runtimeDataProps = [ "requiredProp", "queryStringObject" ];

    constructor(requiredProp, queryStringObject) {
        super("SYNC: req.query is missing required property");
        this.name = "MissingQueryStringPropError";

        this.requiredProp = requiredProp;
        this.queryStringObject = queryStringObject;
        this.runtimeDataPropsRef = MissingQueryStringPropError.runtimeDataProps;
    }

}

class MissingRequiredFieldError extends Error {

    static runtimeDataProps = [ "notNullArray", "requestData", "requiredField" ];

    constructor(notNullArray, requestData, requiredField) {
        super("SYNC: requestData does not have the required fields");
        this.name = "MissingRequiredFieldError";
        this.responseMessage = "Malformed data";

        this.notNullArray = notNullArray;
        this.requestData = requestData;
        this.requiredField = requiredField;
        this.runtimeDataPropsRef = MissingRequiredFieldError.runtimeDataProps;
    }
}

class InvalidRequiredFieldError extends Error {

    static runtimeDataProps = [ "notNullArray", "requestData", "requiredField", "current" ];

    constructor(notNullArray, requestData, requiredField, current) {
        super("SYNC: request data field is malformed");
        this.name = "InvalidRequiredFieldError";
        this.responseMessage = "Malformed data";

        this.notNullArray = notNullArray;
        this.requestData = requestData;
        this.requiredField = requiredField;
        this.current = current;
        this.runtimeDataPropsRef = InvalidRequiredFieldError.runtimeDataProps;
    }
}

class InvalidJsTypeError extends Error {

    static runtimeDataProps = [ "expectedType", "actualType" ];

    constructor(expectedType, actualType) {
        super("SYNC: request data field is malformed");
        this.name = "InvalidJsTypeError";
        this.responseMessage = "Malformed data";

        this.expectedType = expectedType;
        this.actualType = actualType;
        this.runtimeDataPropsRef = InvalidJsTypeError.runtimeDataProps;
    }
}

class IntNumberBoundsError extends Error {

    static runtimeDataProps = [ "bounds", "data" ];

    constructor(bounds, data) {
        super("SYNC: integer database data type is not within proper constraints");
        this.name = "IntNumberBoundError";
        this.responseMessage = "Malformed data";

        this.bounds = bounds;
        this.data = data;
        this.runtimeDataPropsRef = IntNumberBoundsError.runtimeDataProps;
    }
}

class InvalidVarcharLengthError extends Error {

    static runtimeDataProps = [ "bounds", "data" ];

    constructor(bounds, data) {
        super("SYNC: varchar database data type is not within proper constraints");
        this.name = "InvalidVarcharLengthError";
        this.responseMessage = "Malformed data";

        this.bounds = bounds;
        this.data = data;
        this.runtimeDataPropsRef = InvalidVarcharLengthError.runtimeDataProps;
    }
}

class BlacklistError extends Error {

    static runtimeDataProps = [ "blacklist", "data" ];

    constructor(blacklist, data) {
        super("SYNC: data includes blacklisted elements");
        this.name = "BlackListError";
        this.responseMessage = "Malformed data";

        this.blacklist = blacklist;
        this.data = data;
        this.runtimeDataPropsRef = BlacklistError.runtimeDataProps;
    }
}

class WhitelistError extends Error {

    static runtimeDataProps = [ "blacklist", "data" ];

    constructor(whitelist, data) {
        super("SYNC: data includes blacklisted elements");
        this.name = "WhitelistError";
        this.responseMessage = "Malformed data";

        this.whitelist = whitelist;
        this.data = data;
        this.runtimeDataPropsRef = WhitelistError.runtimeDataProps;
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
    MissingQueryStringPropError,
    MissingRequiredFieldError,
    InvalidRequiredFieldError,
    InvalidJsTypeError,
    IntNumberBoundsError,
    InvalidVarcharLengthError,
    BlacklistError,
    WhitelistError,
    InvalidPrimaryKeyError,
    UniquenessError,
    SwitchFallThroughRuntimeError
};