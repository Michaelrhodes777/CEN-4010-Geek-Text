const bcrypt = require('bcrypt');
const { comparePasswords } = require('../../../util/hashing/Hashing.js');

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
        this.customErrorType = "LoginError";
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

class DatabaseUsernameCheckFailureError extends ErrorInterface {
    static runtimeDataProps = [ "username", "queryObject", "response" ];

    constructor(errorPayload) {
        super(`Database failure occured`, errorPayload);
        this.name = "DatabaseUsernameCheckFailureError";
        this.statusCode = 500;
        this.responseMessage = "Internal server error";
    }
}

class UsernameDoesNotExistError extends ErrorInterface {
    static runtimeDataProps = [ "username", "queryObject", "response" ];

    constructor(errorPayload) {
        super(`Username ${errorPayload.username} DNE in database`, errorPayload);
        this.name = "UsernameDoesNotExistError";
        this.statusCode = 403;
        this.responseMessage = "Access forbidden";
    }
}

class HashedPasswordDoesNotMatchProvidedPasswordError extends ErrorInterface {
    static runtimeDataProps = [ "hashedPassword" ];

    constructor(errorPayload) {
        super(`Hashed password does not match the provided password`, errorPayload);
        this.name = "HashedPasswordDoesNotMatchProvidedPasswordError";
        this.statusCode = 403;
        this.responseMessage = "Access forbidden";
    }
}

class RefreshTokenPersistenceFailureError extends ErrorInterface {
    static runtimeDataProps = [ "databaseResponse", "queryObject", "username" ];

    constructor(errorPayload) {
        super(`Database failed to persist refresh_token to user "${errorPayload.username}"`, errorPayload);
        this.name = "RefreshTokenPersistenceFailureError";
        this.statusCode = 500;
        this.responseMessage = "Internal server error";
    }
}

const ErrorsTestMap = {
    "DatabaseUsernameCheckFailureError": DatabaseUsernameCheckFailureError,
    "UsernameDoesNotExistError": UsernameDoesNotExistError,
    "HashedPasswordDoesNotMatchProvidedPasswordError": HashedPasswordDoesNotMatchProvidedPasswordError,
    "RefreshTokenPersistenceFailureError": RefreshTokenPersistenceFailureError
};

class Logic {
    static async validateUserExists(username, client) {
        const queryObject = {
            text: `SELECT ( "password" ) FROM login WHERE username = $1`,
            values: [ username ]
        };
        const response = await client.query(queryObject);
        const rows = response?.rows;
        if (!response || !rows) {
            throw new DatabaseUsernameCheckFailureError({
                "username": username,
                "queryObject": JSON.stringify(queryObject),
                "response": JSON.stringify(response)
            });
        }
        
        if (rows.length === 0) {
            throw new UsernameDoesNotExistError({
                "username": username,
                "queryObject": JSON.stringify(queryObject),
                "response": JSON.stringify(response)   
            });
        }
        
        return { "hashedPassword": rows[0].password, "role": rows[0].role };
    }

    static async validateHashedPassword(password, hashedPassword) {
        const comparison = await comparePasswords(password, hashedPassword);
        if (!comparison) {
            throw new HashedPasswordDoesNotMatchProvidedPasswordError({ "hashedPassword": hashedPassword});
        }
    }

    static validateRefreshTokenPersistence(databaseResponse, queryObject, username) {
        if (!databaseResponse || databaseResponse.rows.length === 0) {
            throw new RefreshTokenPersistenceFailureError({
                "databaseResponse": JSON.stringify(databaseResponse),
                "queryObject": JSON.stringify(queryObject),
                "username": username
            });
        }
    }
}

class CustomValidation {
    static async validateUserRequestAndGetRole(body, client) {
        const databasePayload = await Logic.validateUserExists(body.username, client);
        await Logic.validateHashedPassword(body.password, databasePayload.hashedPassword);
        return databasePayload.role;
    }

    static validateRefreshTokenPersistence = Logic.validateRefreshTokenPersistence;
}

module.exports = {
    ErrorInterface,
    ErrorsTestMap,
    Logic,
    CustomValidation
};