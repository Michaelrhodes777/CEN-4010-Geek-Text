const {
    ReqBodyDoesNotExistError,
    ReqBodyIsNotArrayError,
    ReqBodyLengthIsZeroError
} = require('./Error.js');

class Logic {
    static validateReqBodyStructure(req, errorPayload) {
        if (!req.hasOwnProperty("body")) {
            errorPayload.appendMainArgs({});
            throw new ReqBodyDoesNotExistError(errorPayload);
        }
        if (!Array.isArray(req.body)) {
            errorPayload.appendMainArgs({ 
                "body": String(req.body)
            });
            throw new ReqBodyIsNotArrayError(errorPayload);
        }
        if (req.body.length === 0) {
            errorPayload.appendMainArgs({
                "body": String(req.body)
            });
            throw new ReqBodyLengthIsZeroError(errorPayload);
        }
    }
}

const LogicTestMap = {
    "validateReqBodyStructure": Logic.validateReqBodyStructure
};

module.exports = { Logic, LogicTestMap };