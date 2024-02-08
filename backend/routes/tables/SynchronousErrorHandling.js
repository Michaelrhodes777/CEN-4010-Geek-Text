const ControllerErrors = require('./ControllerErrors.js');
const {
    ErrorPayload,
    ReqDoesNotHaveQueryPropError,
    ReqQueryDoesNotHaveIdPropError,
    ReqQueryIdIsNotArrayError,
    ReqQueryIdIsNotArrayStringFormatError,
    ReqQueryArrayElementNaNError,
    ReqQueryArrayElementIsNotIntegerError,
    MultipleAllQueriesError,
    ReqBodyDoesNotExistError,
    ReqBodyIsNotArrayError,
    NoIterationArrayInDataIteratorError,
    IterationArraysHaveUnequalLengthError,
    MissingQueryStringPropError,
    MissingRequiredFieldError,
    InvalidRequiredFieldError,
    InvalidJsTypeError,
    IntNumberBoundsError,
    InvalidVarcharLengthError,
    BlacklistError,
    WhitelistError,
    SwitchFallThroughRuntimeError
} = ControllerErrors;

// synchronousConstraintIdentifiersMap
const SCIM = {
    "jsType":"jsType",
    "dbType": "dbType",
    "blacklist": "blacklist",
    "whitelist": "whitelist"
};

// synchronousConstraintIdentifiersArray
const SCIA = [
    SCIM.jsType,
    SCIM.dbType,
    SCIM.blacklist,
    SCIM.whitelist
];

const dbTypesMap = {
    "int": "int",
    "varchar": "varchar"
};

class BaseValidations {

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
            console.log(errorPayload.mainArgs);
            throw new ReqQueryIdIsNotArrayStringFormatError(errorPayload);
        }

        try {
            const parsed = JSON.parse(req.query.id)
            if (!Array.isArray(parsed)) {
                throw new Error();
            }
        }
        catch (error) {
            errorPayload.appendMainArgs({ "id": JSON.stringify(req.query.id) });
            throw new ReqQueryIdIsNotArrayError(errorPayload);
        }

        const parsedArray = JSON.parse(req.query.id);
        let zeroCount = 0;
        for (let entity of parsedArray) {
            const parsed = parseInt(entity);
            if (parsed === NaN) {
                errorPayload.appendMainArgs({
                    "query": JSON.stringify(req.query),
                    "id": req.query.id
                });
                throw new ReqQueryArrayElementNaNError(errorPayload);
            }
            if (!Number.isInteger(parsed)) {
                errorPayload.appendMainArgs({
                    "query": JSON.stringify(req.query),
                    "id": req.query.id,
                    "parsed": parsed
                });
                throw new ReqQueryArrayElementIsNotIntegerError(errorPayload);
            }
            if (entity === 0) {
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
                "req": JSON.stringify(req), 
                "body": JSON.stringify(req.body)
            });
            req = null;
            throw new ReqBodyIsNotArrayError(errorPayload);
        }

        req = null;
        errorPayload = null;
    }

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
        let hasIllegalElements = true;
        for (let i = 0; i < currentConstraint.length && hasIllegalElements; i++) {
            if (data == currentConstraint) {
                hasIllegalElements = false;
            }
        }
        if (hasIllegalElements) {
            errorPayload.appendMainArgs({
                "whitelist": JSON.stringify(currentConstraint),
                "data": String(data)
            });
            currentConstraint = null;
            data = null;
            throw new WhitelistError(errorPayload);
        }

        currentConstraint = null;
        data = null;
        errorPayload = null;
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

class Logic {

    // if idArray passed, assumes req.query.id conversion to typeof array
    static dataIterator(Model, req, idArray = null, validateRequiredFields) {
        const hasBody = req.hasOwnProperty("body");
        if (idArray === null && !hasBody) {
            throw new NoIterationArrayInDataIteratorError(new ErrorPayload());
        }
        if (idArray !== null && hasBody && idArray.length !== req.body.length) {
            const errorPayload = new ErrorPayload();
            errorPayload.appendMainArgs({
                "idArray": JSON.stringify(idArray),
                "body": JSON.stringify(req.body)
            });
            throw new IterationArraysHaveUnequalLengthError(errorPayload);
        }

        const iterationLength = hasBody ? req.body.length : idArray.length;

        let errorPayload = new ErrorPayload();
        for (let i = 0; i < iterationLength; i++) {
            let dataObject = hasBody ? req.body[i] : {};
            if (idArray !== null) {
                dataObject[Model.idName] = idArray[i]
            }
            errorPayload.auxiliaryArgs.indexOfIteration = i;
            if (validateRequiredFields) {
                BaseValidations.validateRequiredReqBodyFields(Model.notNullArray, dataObject, errorPayload);
            }
            Logic.propValidation(Model, dataObject, errorPayload);
        }

        Model = null;
        req = null;
        idArray = null;
        errorPayload = null;
    }

    static propValidation(Model, dataObject, errorPayload) {
        for (let columnName of Model.columnNamesArray) {
            if (dataObject.hasOwnProperty(columnName)) {
                Logic.validationSwitches(Model.synchronousConstraintSchema[columnName], dataObject[columnName], errorPayload);
            }
        }
        Model = null;
        dataObject = null;
        errorPayload = null;
    }

    static validationSwitches(synchronousConstraints, data, errorPayload) {
        const { jsTypeValidation, validateIntDbType, validateVarcharDbType, blacklistValidation, whitelistValidation } = BaseValidations;
        for (let SCI of SCIA) {
            let currentConstraint = synchronousConstraints[SCI];
            if (currentConstraint != null) {
                switch (SCI) {
                    case SCIM.jsType:
                        jsTypeValidation(currentConstraint, data, errorPayload);
                        break;
                    case SCIM.dbType:
                        const type = currentConstraint.type;
                        switch (type) {
                            case dbTypesMap.int:
                                validateIntDbType(currentConstraint.bounds, data, errorPayload);
                                break;
                            case dbTypesMap.varchar:
                                validateVarcharDbType(currentConstraint.bounds, data, errorPayload);
                                break;
                            default:
                                throw new SwitchFallThroughRuntimeError("dbTypeValidation", { switchArg: type, auxiliaryArgs: [ currentConstraint, data ]});
                        }
                        break;
                    case SCIM.blacklist:
                        blacklistValidation(currentConstraint, data, errorPayload);
                        break;
                    case SCIM.whitelist:
                        whitelistValidation(currentConstraint, data, errorPayload);
                        break;
                    default:
                        throw new SwitchFallThroughRuntimeError("synchronousConstraintErrorHandling", { switchArg: SCI, auxiliaryArgs: [data] });
                }
            }
        }

        synchronousConstraints = null;
        data = null;
        errorPayload = null;
    }
}

class SyncCompositions {
    static createControllerSynchronousValidation(Model, req) {
        BaseValidations.validateReqBodyStructure(req, new ErrorPayload());
        Logic.dataIterator(Model, req, null, true);
    }

    static readControllerSynchronousValidation(Model, req) {
        BaseValidations.validateIdQueryString(req, new ErrorPayload());
        Logic.dataIterator(Model, {}, JSON.parse(req.query.id), false);
    }

    static updateControllerSynchronousValidation(Model, req) {
        BaseValidations.validateIdQueryString(req, new ErrorPayload());
        BaseValidations.validateReqBodyStructure(req, new ErrorPayload());
        Logic.dataIterator(Model, req, JSON.parse(req.query.id), false);
    }

    static deleteControllerSynchronousValidation(Model, req) {
        BaseValidations.validateIdQueryString(req, new ErrorPayload());
        Logic.dataIterator(Model, {}, JSON.parse(req.query.id), false);
    }
}

module.exports = {
    SCIA,
    SCIM,
    BaseValidations,
    Logic,
    SyncCompositions,
};