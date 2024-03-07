const express = require('express');
const router = express.Router();
const { updateController } = require('./controllers.js');
const { RefreshTokenValidation } = require('../RefreshTokenValidation.js');
const { validateDataIntegrityMiddleware } = RefreshTokenValidation;

class HeadersDoesNotContainAuthorizationError extends DataIntegrityError {
    static runtimeDataProps = [ "headers" ];

    constructor(errorPayload) {
        super(`req.headers does not contain "authorization" || "Authorization" field`);
        this.name = "HeadersDoesNotContainAuthorizationError";
        this.statusCode = 400;
        this.mainArgs = errorPayload;
    }
}
class AuthorizationFieldDoesNotStartWithBearerError extends DataIntegrityError {
    static runtimeDataProps = [ "headers", "authorization" ];

    constructor(errorPayload) {
        super(`req.headers.~authorization || Authorization~ does not start with "Bearer "`);
        this.name = "AuthorizationFieldDoesNotStartWithBearerError";
        this.statusCode = 400;
        this.mainArgs = errorPayload;
    }
}
// if (!authorization) {
//     throw new HeadersDoesNotContainAuthorizationError ({ "cookies": JSON.stringifiy(req.cookies) });
// }
// if (authorization.length < 7 || authorization.substring(0, 7) !== "Bearer ") {
//     throw new AuthorizationFieldDoesNotStartWithBearerError({ "headers": JSON.stringify(req.headers), "authorization": authorization });
// }
// if (authorization === "Bearer " || authorization === "Bearer undefined") {
//     throw new InvalidRefreshTokenAppensionError({ "headers": JSON.stringify(req.headers), "authorization": authorization })
// }

router.route("")
    .update(validateDataIntegrityMiddleware, updateController);

module.exports = router;