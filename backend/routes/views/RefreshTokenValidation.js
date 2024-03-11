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
        this.customErrorType = "Refresh Token Error";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = errorPayload;
        this.auxArgs = null;
        this.name = null;
        this.iterationIndex = null;
        this.controllerType = null;
        this.loggingPayload = null;
        this.name = null;
    }
}

class ReqDoesNotContainCookiesFieldError extends ErrorInterface {
    static runtimeDataProps = [];

    constructor(errorPayload) {
        super(`req does not contain field "cookies"`);
        this.name = "ReqDoesNotContainCookiesFieldError";
        this.statusCode = 400;
        this.errorPayload = errorPayload;
    }
}
class CookiesDoesNotContainJWTFieldError extends ErrorInterface {
    static runtimeDataProps = [ "cookies" ];

    constructor(errorPayload) {
        super(`req.cookies does not contain "jwt" field`);
        this.name = "CookiesDoesNotContainJWTFieldError";
        this.statusCode = 400;
        this.mainArgs = errorPayload;
    }
}
class JWTFieldDoesNotStartWithBearerError extends ErrorInterface {
    static runtimeDataProps = [ "cookies", "jwt" ];

    constructor(errorPayload) {
        super(`req.cookies.jwt does not start with "Bearer "`);
        this.name = "JWTFieldDoesNotStartWithBearerError";
        this.statusCode = 400;
        this.mainArgs = errorPayload;
    }
}
class InvalidJWTTokenAppensionError extends ErrorInterface {
    static runtimeDataProps = [ "cookies", "jwt" ];

    constructor(errorPayload) {
        super(`Invalid refresh token has been appended to "Bearer " string`);
        this.name = "InvalidJWTTokenAppensionError";
        this.statusCode = 400;
        this.mainArgs = errorPayload;
    }
}
class RefreshTokenIsNullError extends ErrorInterface {
    static runtimeDataProps = [ "cookies", "jwt" ];

    constructor(errorPayload) {
        super(``);
        this.name = "RefreshTokenIsNullError";
        this.statusCode = 400;
        this.mainArgs = errorPayload;
    }
}

const ErrorsTestMap = {};

class Logic {
    static validateReq(req) {
        const { cookies } = req;
        if (!cookies) {
            throw new ReqDoesNotContainCookiesFieldError({});
        }
        const { jwt } = cookies;
        if (!jwt) {
            throw new CookiesDoesNotContainJWTFieldError({ "cookies": JSON.stringify(req.cookies) });
        }
    }

    static validateJWT(req) {
        const { jwt } = req.cookies;
        if (jwt.length < 7 || jwt.substring(0, 7) !== "Bearer ") {
            throw new JWTFieldDoesNotStartWithBearerError({ "cookies": JSON.stringify(req.cookies), "jwt": jwt });
        }
        if (jwt === "Bearer " || jwt === "Bearer undefined") {
            throw new InvalidJWTTokenAppensionError({ "cookies": JSON.stringify(req.cookies), "jwt": jwt })
        }
        if (jwt === "Bearer null") {
            throw new RefreshTokenIsNullError({ "cookies": JSON.stringify(req.cookies), "jwt": jwt });
        }
    }
}

class RefreshTokenValidation {
    static validateRefreshTokenIntregrityMiddleware(req, res, next) {
        Logic.validateReq(req);
        //Logic.validateJWT(req);
        next();
    }
}

module.exports = {
    ErrorInterface,
    ErrorsTestMap,
    Logic,
    RefreshTokenValidation
};