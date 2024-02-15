const {
    ErrorPayload,
    ReqDoesNotHaveQueryPropError,
    ReqQueryDoesNotHaveIdPropError,
    ReqQueryIdIsNotArrayStringFormatError,
    ReqQueryIdIsNotArrayError,
    ReqQueryArrayElementNaNError,
    ReqQueryArrayElementIsNotIntegerError,
    MultipleAllQueriesError,
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
    static validateIdQueryString(req, errorPayload) {
        if (!req.hasOwnProperty("query")) {
            throw new ReqDoesNotHaveQueryPropError(errorPayload);
        }
        if (!req.query.hasOwnProperty("id")) {
            errorPayload.appendMainArgs({ "query": JSON.stringify(req.query) });
            throw new ReqQueryDoesNotHaveIdPropError(errorPayload);
        }
        const len = req.query.id.length;
        if (len < 3 || req.query.id[0] !== "[" || req.query.id[len - 1] !== "]") {
            errorPayload.appendMainArgs({ "id": req.query.id });
            throw new ReqQueryIdIsNotArrayStringFormatError(errorPayload);
        }

        let parsedArray;

        try {
            parsedArray = req.query.id.substring(1, req.query.id.length - 1).split(",");
            if (!Array.isArray(parsedArray)) {
                throw new Error();
            }
        }
        catch (error) {
            errorPayload.appendMainArgs({ "id": JSON.stringify(req.query.id) });
            throw new ReqQueryIdIsNotArrayError(errorPayload);
        }

        let zeroCount = 0;
        for (let entity of parsedArray) {
            const parsed = +entity;
            if (Number.isNaN(parsed)) {
                errorPayload.appendMainArgs({
                    "query": JSON.stringify(req.query),
                    "id": JSON.stringify(req.query.id)
                });
                throw new ReqQueryArrayElementNaNError(errorPayload);
            }
            if (!Number.isInteger(parsed)) {
                errorPayload.appendMainArgs({
                    "query": JSON.stringify(req.query),
                    "id": JSON.stringify(req.query.id),
                    "parsed": JSON.stringify(parsed)
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
                "id": req.query.id
            });
            throw new MultipleAllQueriesError(errorPayload);
        }
    }

    static validateReqBodyStructure(req, errorPayload) {
        if (!req.hasOwnProperty("body")) {
            errorPayload.appendMainArgs({});
            req = null;
            throw new ReqBodyDoesNotExistError(errorPayload);
        }
        if (!Array.isArray(req.body)) {
            errorPayload.appendMainArgs({ 
                "body": JSON.stringify(req.body)
            });
            req = null;
            throw new ReqBodyIsNotArrayError(errorPayload);
        }

        req = null;
        errorPayload = null;
    }

    static validateLinkingTableQueryString(req, errorPayload) {}

    static validateRequiredReqBodyFields(notNullArray, dataObject, errorPayload) {
        for (let requiredField of notNullArray) {
            if (!dataObject.hasOwnProperty(requiredField)) {
                errorPayload.appendMainArgs({
                    "notNullArray": JSON.stringify(notNullArray),
                    "dataObject": JSON.stringify(dataObject),
                    requiredField
                });
                notNullArray = null;
                dataObject = null;
                throw new MissingRequiredFieldError(errorPayload);
            }
            else {
                let current = dataObject[requiredField];
                if (current === null || current === "") {
                    errorPayload.appendMainArgs({
                        "notNullArray": JSON.stringify(notNullArray),
                        "dataObject": JSON.stringify(dataObject),
                        requiredField,
                        current
                    });
                    notNullArray = null;
                    dataObject = null;
                    throw new InvalidRequiredFieldError(errorPayload);
                }
            }
        }

        notNullArray = null;
        dataObject = null;
        errorPayload = null;
    }

    static jsTypeValidation(currentConstraint, data, errorPayload) {
        if (!(typeof data === currentConstraint)) {
            errorPayload.appendMainArgs({
                "expectedType": currentConstraint,
                "actualType": typeof data
            });
            currentConstraint = null;
            data = null;
            throw new InvalidJsTypeError(errorPayload);
        }

        currentConstraint = null;
        data = null;
        errorPayload = null;
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
                "bounds": JSON.stringify(bounds), 
                "data": String(data)
            });
            bounds = null;
            data = null;
            throw new IntNumberBoundsError(errorPayload);
        }

        bounds = null
        data = null;
        errorPayload = null;
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
                "bounds": JSON.stringify(bounds),
                "data": String(data)
            });
            bounds = null;
            data = null;
            throw new InvalidVarcharLengthError(errorPayload);
        }

        bounds = null;
        data = null;
        errorPayload = null;
    }

    static blacklistValidation(currentConstraint, data, errorPayload) {
        const hasBlacklistedElement = currentConstraint.join("").includes(data);
        if (hasBlacklistedElement) {
            errorPayload.appendMainArgs({
                "blacklist": JSON.stringify(currentConstraint),
                "data": String(data)
            });
            currentConstraint = null;
            data = null;
            throw new BlacklistError(errorPayload);
        }

        currentConstraint = null;
        data = null;
        errorPayload = null;
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
            currentConstraint = null;
            data = null;
            throw new WhitelistError(errorPayload);
        }

        currentConstraint = null;
        data = null;
        errorPayload = null;
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
                    "queryStringRequirements": JSON.stringify(queryStringRequirements),
                    "queryStringObject": JSON.stringify(queryStringObject) 
                });
                queryStringRequirements = null;
                queryStringObject = null;
                throw new MissingQueryStringPropError(errorPayload);
            }
        }

        queryStringRequirements = null;
        queryStringObject = null;
        errorPayload = null;
    }
}

module.exports = SyncBaseValidations;