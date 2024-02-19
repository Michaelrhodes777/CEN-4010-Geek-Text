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

function parseStringifiedArray(stringifiedArray) {
    return stringifiedArray.substring(1, stringifiedArray.length - 1).split(",");
}

function idArrayWrapper(idArray, sliceLength = 1) {
    idArray = parseStringifiedArray(idArray);
    const build = new Array(idArray.length / sliceLength);
    for (let i = 0; i < idArray.length; i += sliceLength) {
        const internalBuild = new Array(sliceLength);
        for (let j = 0; j < sliceLength; j++) {
            internalBuild[j] = Number(idArray[i + j]);
        }
        build[i / sliceLength] = internalBuild;
    }
    return build;
}

function tablesQueryStringValidationMiddleware(controllerType = null) {
    return function(req, res, next) {
        const errorPayload = new ErrorPayload();
        validateTablesReqQuery(req, errorPayload);
        validateStandardQueryString(req.query, errorPayload);
        req.keyArrays = idArrayWrapper(req.query.id);
        if (controllerType === null) {
            validateBodyKeyArraysMatchingLength(req.keyArrays, req.body, errorPayload); 
        }
        validateNoDuplicateIds(req.keyArrays, errorPayload);
        next();
    }
}

function linkingTablesQueryStringValidationMiddleware(Model, controllerType = null) {
    return function(req, res, next) {
        const errorPayload = new ErrorPayload();
        validateLinkingTablesReqQuery(req, errorPayload);
        validateStandardQueryString(req.query, errorPayload);
        const queryCondition = determineQueryCondition(req.query);
        console.log(queryCondition);
        req.queryCondition = queryCondition;
        if (req.queryCondition === "cid") {
            req.keyArrays = idArrayWrapper(req.query[queryCondition], Model.compositePkeys.length);
            console.log(Model.compositePkeys.length);
            validateCidKeyArray(Model, req.query.cid, errorPayload);
        }
        else {
            req.keyArrays = idArrayWrapper(req.query[queryCondition]);
        }
        if (controllerType === null) {
            validateBodyKeyArraysMatchingLength(req.keyArrays, req.body, errorPayload);
        }
        validateNoDuplicateIds(req.keyArrays, errorPayload);
        next();
    }
}

module.exports = {
    tablesQueryStringValidationMiddleware,
    linkingTablesQueryStringValidationMiddleware
};