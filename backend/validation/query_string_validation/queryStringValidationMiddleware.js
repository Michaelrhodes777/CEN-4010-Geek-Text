const { ErrorPayload } = require('./Errors.js');
const { Logic } = require('./Logic.js');
const {
    validateTablesReqQuery,
    validateLinkingTablesReqQuery,
    validateStandardQueryString,
    validateCidKeyArray,
    validateNoDuplicateIds,
    validateBodyKeyArraysMatchingLength
} = Logic;

function determineQueryCondition(query) {
    return Object.keys(query)[0];
}

function idArrayWrapper(idArray, sliceLength = 1) {
    const build = new Array(idArray.length / sliceLength);
    for (let i = 0; i < idArray.length; i += sliceLength) {
        const internalBuild = new Array(sliceLength);
        for (let j = 0; j < sliceLength; j++) {
            internalBuild[j] = idArray[i + j];
        }
        build[i / sliceLength] = internalBuild;
    }
    return build;
}

function tablesQueryStringValidationMiddleware() {
    return function(req, res, next) {
        const errorPayload = new ErrorPayload();
        validateTablesReqQuery(req, errorPayload);
        validateStandardQueryString(req.query, errorPayload);
        req.keyArrays = idArrayWrapper(req.query.id);
        validateBodyKeyArraysMatchingLength(req.preprocessedData.keyArrays, req.body, errorPayload);
        validateNoDuplicateIds(req.preprocessedData.keyArrays, errorPayload);
        next();
    }
}

function linkingTablesQueryStringValidationMiddleware(Model) {
    return function(req, res, next) {
        const errorPayload = new ErrorPayload();
        validateLinkingTablesReqQuery(req, errorPayload);
        validateStandardQueryString(req.query, errorPayload);
        const queryCondition = determineQueryCondition(req.query);
        if (req.queryCondition === "cid") {
            req.keyArrays = idArrayWrapper(req.query[queryCondition], Model.compositePkeys.lengthA);
            validateCidKeyArray(Model, req.query.cid, errorPayload);
        }
        else {
            req.keyArrays = idArrayWrapper(req.query[queryCondition]);
        }
        validateBodyKeyArraysMatchingLength(req.preprocessedData.keyArrays, req.body, errorPayload);
        validateNoDuplicateIds(req.preprocessedData.keyArrays, errorPayload);
        next();
    }
}

module.exports = {
    tablesQueryStringValidationMiddleware,
    linkingTablesQueryStringValidationMiddleware
};