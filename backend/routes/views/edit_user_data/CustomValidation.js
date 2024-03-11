const bcrypt = require('bcrypt');
const StandardLists = require('../../StandardLists.js');
const { alphanumeric } = StandardLists;

class ErrorInterface extends Error {
    static thisProps = [
        "isCustomError",
        "statusCode",
        "responseMessage",
        "mainArgs",
        "auxArgs",
        "iterationIndex",
        "controllerType",
        "loggingPayload",
        "name"
    ];

    constructor(messageExtension = "", errorPayload) {
        super(`LoginError: ${messageExtension}`);
        this.isCustomError = true;
        this.customErrorType = "EditUserDataError";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = errorPayload;
        this.auxArgs = null;
        this.name = null;
        this.iterationIndex = null;
        this.controllerType = "PUT";
        this.loggingPayload = null;
        this.name = null;
    }
}

class ReqDoesNotHaveQueryError extends ErrorInterface {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super(`req does have "query" prop`, errorPayload);
        this.name = "ReqDoesHaveQueryError";
    }
}

class NoPersistenceDataError extends ErrorInterface {
    static runtimeDataProps = [ "updateableColumns", "body" ];

    constructor(errorPayload) {
        super(`req.body does have any valid persistence props`, errorPayload);
        this.name = "NoPersistenceDataError";
    }
}

class QueryStringDoesNotHaveUsernameFieldError extends ErrorInterface {
    static runtimeDataProps = [ "query" ];

    constructor(errorPayload) {
        super(`req.query does not "username" prop`, errorPayload);
        this.name = "QueryStringDoesNotHaveUsernameFieldError";
    }
}

class QueryStringIsNotAlphanumericError extends ErrorInterface {
    static runtimeDataProps = [ "whitelist", "username", "index", "invalidcharacter" ];

    constructor(errorPayload) {
        super(`username has invalid character '${errorPayload.invalidCharacter}' at index ${errorPayload.index}`, errorPayload);
        this.name = "QueryStringIsNotAlphanumericError";
    }
}

class UsernameDoesNotExistError extends ErrorInterface {
    static runtimeDataProps = [ "username", "queryObject", "response", "destructure" ];

    constructor(errorPayload) {
        super(`username "${errorPayload.username}" was not found`, errorPayload);
        this.name = "UsernameDoesNotExistError";
        this.responsMessage = "Resource not found";
        this.statusCode = 404;
    }
}

const ErrorsTestMap = {
    "ReqDoesNotHaveQueryError": ReqDoesNotHaveQueryError,
    "NoPersistenceDataError": NoPersistenceDataError,
    "QueryStringDoesNotHaveUsernameFieldError": QueryStringDoesNotHaveUsernameFieldError,
    "QueryStringIsNotAlphanumericError": QueryStringIsNotAlphanumericError
};

class Logic {
    static validateReqHasQuery(req) {
        if (!req.hasOwnProperty("query")) {
            throw new ReqDoesNotHaveQueryError({});
        }
    }

    static validatePersistenceData(Model, req) {
        let foundOneProp = false;
        for (let columnName of Model.updateableColumns) {
            if (req.body.hasOwnProperty(columnName)) {
                foundOneProp = true;
                break;
            }
        }
        if (!foundOneProp) {
            throw new NoPersistenceDataError({
                "updateableColumns": JSON.stringify(Model.updateableColumns),
                "body": JSON.stringify(req.body)
            });
        }
    }

    static validateQueryString(query) {
        if (!query.hasOwnProperty("username")) {
            throw new QueryStringDoesNotHaveUsernameFieldError({ "query": JSON.stringify(query) });
        }

        const { username } = query;
        let hasIllegalElements = false;
        let i;
        for (i = 0; i < username.length && !hasIllegalElements; i++) {
            if (!alphanumeric.includes(username[i])) {
                hasIllegalElements = true;
            }
        }
        if (hasIllegalElements) {
            throw new QueryStringIsNotAlphanumericError({
                "whitelist": JSON.stringify(alphanumeric),
                "username": username,
                "index": String(i),
                "invalidCharacter": username[i]
            });
        }
    }

    static async validateUsernameExistence(Model, username, client) {
        const queryObject = {
            text: `SELECT ( "username" ) FROM ${Model.tableName} WHERE username = $1`,
            values: [ username ] 
        };
        const response = await client.query(queryObject);
        const destructure = response?.rows?.[0]?.username;
        if (!destructure) {
            throw new UsernameDoesNotExistError({
                "username": username,
                "queryObject": JSON.stringify(queryObject),
                "response": JSON.stringify(response),
                "destructure": JSON.stringify(destructure)
            });
        }
    }
}

class CustomValidation {
    static validateDataIntegrityMiddleware(Model) {
        return function(req, res, next) {
            Logic.validateReqHasQuery(req);
            Logic.validatePersistenceData(Model, req);
            Logic.validateQueryString(req.query);
            next();
        }
    }

    static validateUsernameExistence = Logic.validateUsernameExistence;
}

module.exports = {
    ErrorInterface,
    ErrorsTestMap,
    CustomValidation
};