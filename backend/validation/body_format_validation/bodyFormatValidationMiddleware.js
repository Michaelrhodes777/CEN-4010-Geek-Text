const { ErrorPayload } = require('../ErrorPayload.js');
const { Logic } = require('./Logic.js');
const { validateReqBodyStructure } = Logic;

function bodyFormatValidationMiddleware(req, res, next) {
    validateReqBodyStructure(req, new ErrorPayload());
    next();
}

module.exports = bodyFormatValidationMiddleware;