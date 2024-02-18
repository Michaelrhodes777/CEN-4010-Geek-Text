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

class InvalidPrimaryKeyError extends ControllerError {

    static runtimeDataProps = [ "primaryKey", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("ASYNC: Database failed to validate primary key", errorPayload);
        this.name = "InvalidPrimaryKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class InvalidCompositeKeyError extends ControllerError {

    static runtimeDataProps = [ "compositeKeys", "currenIndex", "currentKeys", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("ASYNC: Database failed to validate composite key existence", errorPayload);
        this.name = "InvalidCompositeKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class CompositeKeyAlreadyExistsError extends ControllerError {

    static runtimeDataProps = [ "compositeKeys", "currenIndex", "currentKeys", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("ASYNC: composite key already exists", errorPayload);
        this.name = "CompositeKeyAlreadyExistsError";
        this.statusCode = 409;
        this.responseMessage = "Conflicting Resource";
    }
}

class InvalidQueryableKeyError extends ControllerError {

    static runtimeDataProps = [ "queryablePkey", "currentIndex", "key", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("ASYNC: Database failed to validate queryable key existence", errorPayload);
        this.name = "InvalidQueryableKeyError";
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

class SwitchFallThroughRuntimeError extends Error {
    constructor(message, obj) {
        super(message);
        this.name = "SwitchFallThroughRuntimeError";
        this.auxiliaries = JSON.stringify(obj);
    }
}

module.exports = {
    ErrorPayload,
    InvalidPrimaryKeyError,
    InvalidCompositeKeyError,
    CompositeKeyAlreadyExistsError,
    InvalidQueryableKeyError,
    InvalidForeignKeyError,
    UniquenessError,
    SwitchFallThroughRuntimeError
};