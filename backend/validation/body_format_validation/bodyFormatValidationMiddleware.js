const { ErrorPayload } = require('./Errors.js');
const { validateReqBodyStructure } = require('./Logic.js');

function bodyFormatValidationMiddleware(req, res, next) {
    validateReqBodyStructure(req, new ErrorPayload());
}

module.exports =  bodyFormatValidationMiddleware;