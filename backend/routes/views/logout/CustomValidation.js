class ErrorInterface extends Error {
    constructor(messageExtension = "") {
        super(`ErrorInterface: ${messageExtension}`);
        this.isCustomError = true;
        this.customErrorType = "LogoutValidationError";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = null;
        this.auxArgs = null;
        this.name = null;
        this.iterationIndex = null;
        this.controllerType = null;
        this.loggingPayload = null;
        this.name = null;
    }
}

class RefreshTokenNotFoundError extends ErrorInterface {
    static runtimeDataProps = [ "cookies", "jwt", "databaseQueryObject", "databaseResponse", "rows" ];

    constructor(errorPayload) {
        super("refresh_token was not found it the database");
        this.name = "RefreshTokenNotFoundError";    
        this.statusCode = 404;
        this.mainArgs = errorPayload;
    }
}

class InvalidUserIdError extends ErrorInterface {
    static runtimeErrorProps = [ "cookies", "jwt", "databaseQueryObjec", "databaseResponse", "rows", "user_id" ];

    constructor(errorPayload) {
        super("user_id was not found in database");
        this.name = "InvalidUserIdError";
        this.statusCode = 500;
        this.mainArgs = errorPayload;
    }
}

class DatabaseFailedToSetRefreshTokenToNullError extends ErrorInterface {
    static runtimeDataProps = [ "cookies", "jwt", "databaseQueryObject", "databaseResponse", "user_id", "updateQueryObject", "updateResponse" ];

    constructor(errorPayload) {
        super(`database failed to set the refresh_token field to null under user_id ${errorPayload.user_id}`);
        this.name = "DatabaseFailedToSetRefreshTokenToNullError";
        this.statusCode = 500;
        this.mainArgs = errorPayload;
    }
}

const ErrorsTestMap = {
    "RefreshTokenNotFoundError": RefreshTokenNotFoundError,
    "InvalidUserIdError": InvalidUserIdError,
    "DatabaseFailedToSetRefreshTokenToNullError": DatabaseFailedToSetRefreshTokenToNullError
};

class Logic {
    static validateRefreshTokenExistence(req, databaseQueryPayload) {
        const { databaseQueryObject, databaseResponse } = databaseQueryPayload;
        if (databaseResponse.rows.length === 0) {
            throw new RefreshTokenNotFoundError({
                "cookies": JSON.stringify(req.cookies),
                "jwt": req.cookies.jwt,
                "databaseQueryObject": JSON.stringify(databaseQueryObject),
                "databaseResponse": JSON.stringify(databaseResponse),
                "rows": JSON.stringify(databaseResponse.rows) 
            });
        }
    }

    static validateUserId(req, databaseQueryPayload) {
        const { databaseQueryObject, databaseResponse } = databaseQueryPayload;
        console.log(databaseQueryPayload.databaseResponse);
        const user_id = databaseResponse?.rows[0]?.user_id;
        if (!user_id) {
            throw new InvalidUserIdError({
                "cookies": JSON.stringify(req.cookies),
                "jwt": req.cookies.jwt,
                "databaseQueryObject": JSON.stringify(databaseQueryObject),
                "databaseResponse": JSON.stringify(databaseResponse),
                "rows": JSON.stringify(databaseResponse.rows),
                "user_id": String(user_id)
            });
        }
    }

    static validateRefreshTokenUpdate(req, databaseQueryPayload, updateQueryPayload) {
        const { databaseQueryObject, databaseResponse } = databaseQueryPayload;
        const { updateQueryObject, updateResponse } = updateQueryPayload;
        console.log(updateResponse.rows[0]);
        const refresh_token = updateResponse?.rows?.[0]?.refresh_token;
        if (refresh_token !== null) {
            throw new DatabaseFailedToSetRefreshTokenToNullError({
                "cookies": JSON.stringify(req.cookies),
                "jwt": req.cookies.jwt,
                "databaseQueryObject": JSON.stringify(databaseQueryObject),
                "databaseResponse": JSON.stringify(databaseResponse),
                "user_id": String(user_id),
                "updateQueryObject": JSON.stringify(updateQueryObject),
                "updateResponse": JSON.stringify(updateResponse)
            });
        }
    }

}

class CustomValidation {
    static validateDatabaseResponse(req, databaseQueryPayload) {
        Logic.validateRefreshTokenExistence(req, databaseQueryPayload);
        Logic.validateUserId(req, databaseQueryPayload);
    }

    static validateRefreshTokenUpdate = Logic.validateRefreshTokenUpdate;
}

module.exports = {
    ErrorInterface,
    ErrorsTestMap,
    Logic,
    CustomValidation
};