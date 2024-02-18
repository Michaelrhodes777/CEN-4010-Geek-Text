const {
    ErrorPayload,
    ReqDoesNotHaveQueryPropError,
    ReqQueryDoesNotHaveIdPropError,
    ReqQueryIdIsNotArrayStringFormatError,
    ReqQueryIdIsNotArrayError,
    ReqQueryArrayElementNaNError,
    ReqQueryArrayElementIsNotIntegerError,
    MultipleAllQueriesError,
    UnequalBodyQidLengthError,
    NonProportionalBodyCidLengthError,
    DuplicateIdKeyError,
    CidArrayModuloNotZeroError,
    DuplicateCidKeyError,
    ReqBodyDoesNotExistError,
    ReqBodyIsNotArrayError,
    MissingQueryStringPropError,
    MissingRequiredFieldError,
    InvalidRequiredFieldError,
    InvalidJsTypeError,
    IntNumberBoundsError,
    InvalidVarcharLengthError,
    BlacklistError,
    WhitelistError,
    RequiredListError,
} = require('./ValidationErrors.js');

class SyncBaseValidations {

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
            throw new ReqQueryDoesNotHaveIdPropError(errorPayload);
        }
        if (Object.keys(req.query).length != 1) {
            errorPayload.appendMainArgs({ "query": String(req.query) });
            throw new ReqQueryHasMoreThanOnePropError(errorPayload);
        }
    }

    static validateStandardQueryString(idObjectPayload, errorPayload) {
        const propName = Object.keys(idObjectPayload)[0];
        const idArray = idObjectPayload[propName];
        const len = idArray.length;
        if (len < 3 || idArray[0] !== "[" || idArray[len - 1] !== "]") {
            errorPayload.appendMainArgs({ "id": String(idArray) });
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
                    "id": String(idArray)
                });
                throw new ReqQueryArrayElementNaNError(errorPayload);
            }
            if (!Number.isInteger(parsed)) {
                errorPayload.appendMainArgs({
                    "query": String(idObjectPayload),
                    "id": String(idArray),
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

    static validateNoDuplicateIds(idArray, errorPayload) {
        const idSet = new Set();
        for (let i = 0; i < idArray.length; i++) {
            if (idSet.has(idArray[i])) {
                errorPayload.appendMainArgs({
                    "idArray": String(idArray),
                    "queryStringIndex": String(i)
                });
                throw new DuplicateIdKeyError(errorPayload);
            }
            else {
                idSet.add(idArray[i]);
            }
        }
    }

    static validateCidQueryString(Model, cidArray, errorPayload) {
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
        const buildArray = new Array(cidArray.length / numComposites);
        for (let i = 0; i < cidArray.length; i += numComposites) {
            const internalBuild = new Array(numComposites);
            for (let j = 0; j < numComposites; j++) {
                internalBuild[j] = cidArray[i + j];
            }
            buildArray[i / numComposites] = internalBuild;
        }
        const compositeKeySet = new Set();
        for (let i = 0; i < buildArray.length; i++) {
            const compositeKeyJoin = buildArray[i].join(",");
            if (compositeKeySet.has(compositeKeyJoin)) {
                errorPayload.appendMainArgs({
                    "parsedCidArray": String(buildArray),
                    "currentIndexOfFailure": String(i),
                    "duplicateCid": String(buildArray[i]),
                    "compositeKeySet": String(compositeKeySet)
                });
                throw new DuplicateCidKeyError(errorPayload);
            }
            else {
                compositeKeySet.add(compositeKeyJoin);
            }
        }
    }

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
    }

    static validateRequiredReqBodyFields(notNullArray, dataObject, errorPayload) {
        for (let requiredField of notNullArray) {
            if (!dataObject.hasOwnProperty(requiredField)) {
                errorPayload.appendMainArgs({
                    "notNullArray": String(notNullArray),
                    "dataObject": String(dataObject),
                    requiredField
                });
                throw new MissingRequiredFieldError(errorPayload);
            }
            else {
                let current = dataObject[requiredField];
                if (current === null || current === "") {
                    errorPayload.appendMainArgs({
                        "notNullArray": String(notNullArray),
                        "dataObject": String(dataObject),
                        requiredField,
                        current
                    });
                    throw new InvalidRequiredFieldError(errorPayload);
                }
            }
        }
    }

    static validateBodyQidMatchingLength(qid, body, errorPayload) {
        if (qid.length !== body.length) {
            errorPayload.appendMainArgs({
                "qid": String(qid),
                "body": String(body),
                "qidLength": String(qid.length),
                "bodyLength": String(body.length)
            });
            throw new UnequalBodyQidLengthError(errorPayload);
        }
    }

    static validateBodyCidMatchingLength(Model, cid, body, errorPayload) {
        const cidMultiplier = Model.compositePkeys.length;
        if (body.length * cidMultiplier !== cid.length) {
            errorPayload.appendMainArgs({
                "cid": String(cid),
                "body": String(body),
                "cidLength": String(cid.length),
                "cidMultiplier": String(cidMultiplier),
                "bodyLength": String(body.length)
            });
            throw new NonProportionalBodyCidLengthError(errorPayload);
        }
    }

    static jsTypeValidation(currentConstraint, data, errorPayload) {
        if (!(typeof data === currentConstraint)) {
            errorPayload.appendMainArgs({
                "expectedType": currentConstraint,
                "actualType": typeof data
            });
            throw new InvalidJsTypeError(errorPayload);
        }
    }

    static validateIntDbType(bounds, data, errorPayload) {
        let buildBoolean = true;

        const lowerBoundType = bounds[0];
        const lowerBound = bounds[1];
        if (lowerBoundType != "-") {
            if (lowerBoundType === "(") {
                buildBoolean = buildBoolean && data > lowerBound;
            }
            if (lowerBoundType === "[") {
                buildBoolean = buildBoolean && data >= lowerBound;
            }
        }

        const upperBoundType = bounds[3];
        const upperBound = bounds[2];
        if (buildBoolean && upperBoundType !== "-") {
            if (upperBoundType === ")") {
                buildBoolean = buildBoolean && data < upperBound;
            }
            if (upperBoundType === "]") {
                buildBoolean = buildBoolean && data <= upperBound;
            }
        }

        if (!buildBoolean) {
            errorPayload.appendMainArgs({
                "bounds": String(bounds),
                "data": String(data)
            });
            throw new IntNumberBoundsError(errorPayload);
        }

    }

    static validateVarcharDbType(bounds, data, errorPayload) {
        let buildBoolean = true;

        const lowerBoundType = bounds[0];
        const lowerBound = bounds[1];
        if (lowerBoundType != "-") {
            if (lowerBoundType === "(") {
                buildBoolean = buildBoolean && data.length > lowerBound;
            }
            if (lowerBoundType === "[") {
                buildBoolean = buildBoolean && data.length >= lowerBound;
            }
        }

        const upperBoundType = bounds[3];
        const upperBound = bounds[2];
        if (buildBoolean && upperBoundType !== "-") {
            if (upperBoundType === ")") {
                buildBoolean = buildBoolean && data.length < upperBound;
            }
            if (upperBoundType === "]") {
                buildBoolean = buildBoolean && data.length <= upperBound;
            }
        }

        if (!buildBoolean) {
            errorPayload.appendMainArgs({
                "bounds": String(bounds),
                "data": String(data)
            });
            throw new InvalidVarcharLengthError(errorPayload);
        }
    }

    static blacklistValidation(currentConstraint, data, errorPayload) {
        const hasBlacklistedElement = currentConstraint.join("").includes(data);
        if (hasBlacklistedElement) {
            errorPayload.appendMainArgs({
                "blacklist": String(currentConstraint),
                "data": String(data)
            });
            throw new BlacklistError(errorPayload);
        }
    }

    static whitelistValidation(currentConstraint, data, errorPayload) {
        let hasIllegalElements = false;
        let i;
        for (i = 0; i < data.length && !hasIllegalElements; i++) {
            if (!currentConstraint.includes(data[i])) {
                hasIllegalElements = true;
            }
        }
        if (hasIllegalElements) {
            errorPayload.appendMainArgs({
                "whitelist": String(currentConstraint),
                "data": data,
                "constraintFailure": data[i]
            });
            throw new WhitelistError(errorPayload);
        }
    }

    static requiredListValidation(currentConstraint, data, errorPayload) {
        for (let array of currentConstraint) {
            let hasAtleastOne = false;
            let i;
            for (i = 0; i < data.length && !hasAtleastOne; i++) {
                if (array.includes(data[i])) {
                    hasAtleastOne = true;
                }
            }
            if (!hasAtleastOne) {
                errorPayload.appendMainArgs({
                    "lists": currentConstraint.map((array) => (`[ ${String(array)} ]`)).join(", "),
                    "index": String(i),
                    "data": data
                });
                throw new RequiredListError(errorPayload);
            }
        }
    }

    static validateQueryString(queryStringRequirements, queryStringObject, errorPayload) {
        for (let requiredProp of queryStringRequirements) {
            if (!queryStringObject.hasOwnProperty(requiredProp)) {
                errorPayload({
                    "queryStringRequirements": String(queryStringRequirements),
                    "queryStringObject": String(queryStringObject) 
                });
                throw new MissingQueryStringPropError(errorPayload);
            }
        }
    }
}

module.exports = SyncBaseValidations;