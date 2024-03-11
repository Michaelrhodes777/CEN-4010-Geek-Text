const ErrorPayload = require('../ErrorPayload.js');
const { bodyIterator, idArrayIterator } = require('./Composition.js');

function schemaValidationMiddleware(Model) {
    return function (req, res, next) {
        const errorPayload = new ErrorPayload();
        const { body, keyArrays, queryCondition } = req;
        if (body !== undefined) {
            const wrapCondition = typeof body === "object" && !Array.isArray();
            bodyIterator(Model, wrapCondition ? [ body ] : body, errorPayload);
        }
        if (keyArrays !== undefined) {
            idArrayIterator(Model, keyArrays, queryCondition, errorPayload);
        }
        next();
    }
}

module.exports = schemaValidationMiddleware;