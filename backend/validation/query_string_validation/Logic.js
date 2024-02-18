const {
    ErrorPayload,
    ReqDoesNotHaveQueryPropError,
    ReqQueryDoesNotHaveIdPropError,
    ReqQueryDoesNotHaveCidOrQidPropError,
    ReqQueryHasMoreThanOnePropError,
    ReqQueryIdIsNotArrayStringFormatError,
    ReqQueryIdIsNotArrayError,
    ReqQueryArrayElementNaNError,
    ReqQueryArrayElementIsNotIntegerError,
    MultipleAllQueriesError,
    UnequalBodyKeyArraysLengthError,
    DuplicateIdKeyError,
    CidArrayModuloNotZeroError
} = require('./Errors.js');

class Logic {

    // not currently used in tables routes
    static validateTablesReqQuery(req, errorPayload) {
        if (!req.hasOwnProperty("query")) {
            throw new ReqDoesNotHaveQueryPropError(errorPayload);
        }
        if (!req.query.hasOwnProperty("id")) {
            errorPayload.appendMainArgs({ "query": String(req.query) });
            throw new ReqQueryDoesNotHaveIdPropError(errorPayload);
        }
        if (Object.keys(req.query).length != 1) {
            errorPayload.appendMainArgs({ "query": String(req.query) });
            throw new ReqQueryHasMoreThanOnePropError(errorPayload);
        }
    }

    static validateLinkingTablesReqQuery(req, errorPayload) {
        if (!req.hasOwnProperty("query")) {
            throw new ReqDoesNotHaveQueryPropError(errorPayload);
        }
        if (!req.query.hasOwnProperty("cid") && !req.query.hasOwnProperty("qid")) {
            errorPayload.appendMainArgs({ "query": String(req.query) });
            throw new ReqQueryDoesNotHaveCidOrQidPropError(errorPayload);
        }
        if (Object.keys(req.query).length > 1) {
            errorPayload.appendMainArgs({ "query": String(req.query) });
            throw new ReqQueryHasMoreThanOnePropError(errorPayload);
        }
    }

    static validateStandardQueryString(idObjectPayload, errorPayload) {
        const propName = Object.keys(idObjectPayload)[0];
        const idArray = idObjectPayload[propName];
        const len = idArray.length;
        if (len < 3 || idArray[0] !== "[" || idArray[len - 1] !== "]") {
            errorPayload.appendMainArgs({ "idArray": String(idArray) });
            throw new ReqQueryIdIsNotArrayStringFormatError(errorPayload);
        }

        let parsedArray;

        try {
            parsedArray = idArray.substring(1, len - 1).split(",");
            if (!Array.isArray(parsedArray)) {
                throw new Error();
            }
        }
        catch (error) {
            errorPayload.appendMainArgs({ "id": String(idArray) });
            throw new ReqQueryIdIsNotArrayError(errorPayload);
        }

        let zeroCount = 0;
        for (let entity of parsedArray) {
            const parsed = +entity;
            if (Number.isNaN(parsed)) {
                errorPayload.appendMainArgs({
                    "query": String(idObjectPayload),
                    "idArray": String(idArray)
                });
                throw new ReqQueryArrayElementNaNError(errorPayload);
            }
            if (!Number.isInteger(parsed)) {
                errorPayload.appendMainArgs({
                    "query": String(idObjectPayload),
                    "idArray": String(idArray),
                    "parsed": String(parsed)
                });
                throw new ReqQueryArrayElementIsNotIntegerError(errorPayload);
            }
            if (parsed === 0) {
                zeroCount++;
            }
        }

        if (zeroCount > 1 || (zeroCount === 1 && parsedArray.length > 1)) {
            const errorPayload = new ErrorPayload();
            errorPayload.appendMainArgs({
                "id": String(idArray)
            });
            throw new MultipleAllQueriesError(errorPayload);
        }
    }

    static validateCidKeyArray(Model, cidArray, errorPayload) {
        const numComposites = Model.compositePkeys.length;
        cidArray = cidArray.substring(1, cidArray.length - 1).split(",");
        if (cidArray.length % numComposites !== 0) {
            errorPayload.appendMainArgs({
                "cidArray": String(cidArray),
                "numComposites": String(numComposites),
                "modulo": String(cidArray.length % numComposites)
            });
            throw new CidArrayModuloNotZeroError(errorPayload);
        }
    }

    static validateBodyKeyArraysMatchingLength(keyArrays, body, errorPayload) {
        if (keyArrays.length !== body.length) {
            errorPayload.appendMainArgs({
                "keyArrays": String(keyArrays),
                "body": String(body),
                "KeyArraysLength": String(keyArrays.length),
                "bodyLength": String(body.length)
            });
            throw new UnequalBodyKeyArraysLengthError(errorPayload);
        }
    }

    static validateNoDuplicateIds(keyArrays, errorPayload) {
        const idSet = new Set();
        for (let i = 0; i < keyArrays.length; i++) {
            if (idSet.has(String(keyArrays[i]))) {
                errorPayload.appendMainArgs({
                    "keyArrays": String(keyArrays),
                    "keyArray": String(keyArrays[i]),
                    "queryStringIndex": String(i)
                });
                throw new DuplicateIdKeyError(errorPayload);
            }
            else {
                idSet.add(String(keyArrays[i]));
            }
        }
    }

}

const LogicTestMap = {
    "validateTablesReqQuery": Logic.validateTablesReqQuery,
    "validateLinkingTablesReqQuery": Logic.validateLinkingTablesReqQuery,
    "validateStandardQueryString": Logic.validateStandardQueryString,
    "validateCidKeyArray": Logic.validateCidKeyArray,
    "validateBodyKeyArraysMatchingLength": Logic.validateBodyKeyArraysMatchingLength,
    "validateNoDuplicateIds": Logic.validateNoDuplicateIds
};

module.exports =  {
    Logic,
    LogicTestMap
};