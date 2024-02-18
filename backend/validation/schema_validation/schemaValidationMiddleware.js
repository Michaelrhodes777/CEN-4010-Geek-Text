const { ErrorPayload } = require('./Errors.js');
const { bodyIterator, idArrayIterator } = require('./copmosition.js');

function schemaValidationMiddleware(Model) {
    return function (req, res, next) {
        const errorPayload = new ErrorPayload();
        const { body, keyArrays, queryCondition } = req;
        if (dataArray !== null) {
            bodyIterator(Model, body, errorPayload);
        }
        if (keyArrays !== null) {
            idArrayIterator(Model, keyArrays, queryCondition, errorPayload);
        }
        next();
    }
}

module.exports = schemaValidationMiddleware;