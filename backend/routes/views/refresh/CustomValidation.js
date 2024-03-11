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
        this.customErrorType = "RefreshError";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = errorPayload;
        this.auxArgs = null;
        this.iterationIndex = null;
        this.controllerType = "PUT";
        this.loggingPayload = null;
        this.name = null;
    }
}

class DatabaseRefreshTokenQueryError extends ErrorInterface {
    static runtimeDataProps = [ "jwt", "queryObject", "databaseResponse" ];

    constructor(errorPayload) {
        super(`No refresh token was found in the database`, errorPayload);
        this.name = "DatabaseRefreshTokenQueryError";
        this.statusCode = 404;
        this.responseMessage = "Resource not found";
    }
}

class JWTDecodingFailureError extends ErrorInterface {
    static runtimeDataProps = [ "jwt", "queryObject", "databaseResponse", "jwtVerificationError" ];

    constructor(errorPayload) {
        super(`JWT.verify threw error`, errorPayload);
        this.name = "JWTDecodingFailureError";
        this.statusCode = 500;
        this.responseMessage = "Internal server error";
    }
}

class InvalidDecodedUsernameError extends ErrorInterface {
    static runtimeDataProps = [ "jwt", "queryObject", "databaseResponse", "jwtVerificationError", "username", "decodedUsername" ];

    constructor(errorPayload) {
        super(`username !== decodedUsername`, errorPayload);
        this.name = "InvalidDecodedUsernameError";
        this.statusCode = 403;
        this.responseMessage = "Access forbidden";
    }
}

class InvalidDecodedRoleError extends ErrorInterface {
    static runtimeDataProps = [ "jwt", "queryObject", "databaseResponse", "jwtVerificationError", "username", "decodedUsername", "role", "decodedRole" ];

    constructor(errorPayload) {
        super(`role !== decodedRole`, errorPayload);
        this.name = "InvalidDecodedRoleError";
        this.statusCode = 403;
        this.responseMessage = "Access forbidden";
    }
}

const ErrorsTestMap = {
    "DatabaseRefreshTokenQueryError": DatabaseRefreshTokenQueryError,
    "JWTDecodingFailureError": JWTDecodingFailureError,
    "InvalidDecodedUsernameError": InvalidDecodedUsernameError,
    "InvalidDecodedRoleError": InvalidDecodedRoleError
};

class Logic {
    static validateDatabaseRefreshTokenQuery(databaseQueryPayload) {
        const { jwt, queryObject, databaseResponse } = databaseQueryPayload;
        if (!databaseResponse) {
            throw new DatabaseRefreshTokenQueryError({
                "jwt": jwt,
                "queryObject": JSON.stringify(queryObject),
                "databaseResponse": JSON.stringify(databaseResponse)
            });
        }
    }

    static validateJWTDecoding(decodingPayload, databaseQueryPayload) {
        const { error } = decodingPayload;
        if (error) {
            const { jwt, queryObject, databaseResponse } = databaseQueryPayload;
            throw new JWTDecodingFailureError({
                "jwt": jwt,
                "queryObject": JSON.stringify(queryObject),
                "databaseResponse": JSON.stringify(databaseResponse),
                "jwtVerificationError": JSON.stringify(error)
            });
        }
    }

    static validateDecodedUsername(decodingPayload, databaseQueryPayload) {
        const { error, username, decodedUsername } = decodingPayload;
        if (username !== decodedUsername) {
            const { jwt, queryObject, databaseResponse } = databaseQueryPayload;
            throw new InvalidDecodedUsernameError({
                "jwt": jwt,
                "queryObject": JSON.stringify(queryObject),
                "databaseResponse": JSON.stringify(databaseResponse),
                "jwtVerificationError": JSON.stringify(error),
                "username": username,
                "decodedUsername": decodedUsername
            });
        }
    }

    static validateDecodedRole(decodingPayload, databaseQueryPayload) {
        const { error, username, decodedUsername, role, decodedRole } = decodingPayload;
        if (role !== decodedRole) {
            const { jwt, queryObject, databaseResponse } = databaseQueryPayload;
            throw new InvalidDecodedRoleError({
                "jwt": jwt,
                "queryObject": JSON.stringify(queryObject),
                "databaseResponse": JSON.stringify(databaseResponse),
                "jwtVerificationError": JSON.stringify(error),
                "username": username,
                "decodedUsername": decodedUsername,
                "role": role,
                "decodedRole": decodedRole
            });
        }
    }
}

class CustomValidation {
    static validateDatabaseRefreshTokenQuery = Logic.validateDatabaseRefreshTokenQuery;

    static validateJWTDecoding(decodingPayload, databaseQueryPayload) {
        Logic.validateJWTDecoding(decodingPayload, databaseQueryPayload);
        Logic.validateDecodedUsername(decodingPayload, databaseQueryPayload);
        //Logic.validateDecodedRole(decodingPayload, databaseQueryPayload);
    }
}

module.exports = {
    ErrorInterface,
    ErrorsTestMap,
    Logic,
    CustomValidation
};