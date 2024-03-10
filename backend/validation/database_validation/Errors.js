class DatabaseValidationError extends Error {
    static thisMapper(build, thisInstantiation) {
        for (let key of Object.keys(build)) {
            thisInstantiation[key] = build[key];
        }
    }

    constructor(message, errorPayload) {
        super("DatabaseValidationError: " + message);
        this.isCustomError = true;
        this.customErrorType = "DatabaseValidationError";
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
            iterationIndex: errorPayload.iterationIndex
        };

        DatabaseValidationError.thisMapper(build, this);
    }
}

class InvalidPrimaryKeyError extends DatabaseValidationError {

    static runtimeDataProps = [ "primaryKey", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("Database failed to validate primary key", errorPayload);
        this.name = "InvalidPrimaryKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class InvalidCompositeKeyError extends DatabaseValidationError {

    static runtimeDataProps = [ "compositeKeys", "currenIndex", "currentKeys", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("Database failed to validate composite key existence", errorPayload);
        this.name = "InvalidCompositeKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class CompositeKeyAlreadyExistsError extends DatabaseValidationError {

    static runtimeDataProps = [ "compositeKeys", "currenIndex", "currentKeys", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("composite key already exists", errorPayload);
        this.name = "CompositeKeyAlreadyExistsError";
        this.statusCode = 409;
        this.responseMessage = "Conflicting Resource";
    }
}

class InvalidQueryableKeyError extends DatabaseValidationError {

    static runtimeDataProps = [ "queryablePkey", "currentIndex", "key", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("Database failed to validate queryable key existence", errorPayload);
        this.name = "InvalidQueryableKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class InvalidForeignKeyError extends DatabaseValidationError {

    static runtimeDataProps = [ "foreignKey", "queryText", "queryValues", "responseRows" ];

    constructor(errorPayload) {
        super("Database failed to validate foreign key existence", errorPayload);
        this.name = "InvalidForeignKeyError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class UniquenessError extends DatabaseValidationError {

    static runtimeDataProps = [ "columnName", "queryString", "valuesArray", "responseRows" ];

    constructor(errorPayload) {
        super("Database failed to validate field uniqueness", errorPayload);
        this.name = "UniquenessError";
        this.statusCode = 409;
        this.responseMessage = "Conflicting resources";
    }
}

const ErrorsTestMap = {
    "InvalidPrimaryKeyError": InvalidPrimaryKeyError,
    "InvalidCompositeKeyError": InvalidCompositeKeyError,
    "CompositeKeyAlreadyExistsError": CompositeKeyAlreadyExistsError,
    "InvalidQueryableKeyError": InvalidQueryableKeyError,
    "InvalidForeignKeyError": InvalidForeignKeyError,
    "UniquenessError": UniquenessError
};

module.exports = {
    DatabaseValidationError,
    InvalidPrimaryKeyError,
    InvalidCompositeKeyError,
    CompositeKeyAlreadyExistsError,
    InvalidQueryableKeyError,
    InvalidForeignKeyError,
    UniquenessError,
    ErrorsTestMap
};