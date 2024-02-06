const ControllerErrors = require('./ControllerErrors.js');
const { 
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

function jsTypeValidation(currentConstraint, data) {
    if (!(typeof data === currentConstraint)) {
        throw new InvalidJsTypeError(currentConstraint, String(data));
    }
}

function dbTypeValidation(currentConstraint, data) {
    console.log('\n');
    console.log(data);
    const type = currentConstraint.type;
    switch (type) {
        case dbTypesMap.int:
            validateIntDbType(currentConstraint.bounds, data);
            break;
        case dbTypesMap.varchar:
            validateVarcharDbType(currentConstraint.bounds, data);
            break;
        default:
            throw new SwitchFallThroughRuntimeError("dbTypeValidation", { switchArg: type, auxiliaryArgs: [ currentConstraint, data ]});
    }
}

function validateIntDbType(bounds, data) {
    let buildBoolean = true;

    const lowerBoundType = bounds[0];
    const lowerBound = bounds[1];
    if (lowerBoundType != "-") {
        if (lowerBoundType === "(") {
            buildBoolean = buildBoolean && data > lowerBound;
        }
        if (lowerBoundType === "[") {
            buildBoolean = buildBoolean && data >= lowerBound;
            console.log(lowerBound);
            console.log(buildBoolean);
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
        throw new IntNumberBoundsError(JSON.stringify(bounds), String(data));
    }
}

function validateVarcharDbType(bounds, data) {
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
        throw new InvalidVarcharLengthError(JSON.stringify(bounds), String(data));
    }
}

function blacklistValidation(currentConstraint, data) {
    const hasBlacklistedElement = currentConstraint.join("").includes(data);
    if (hasBlacklistedElement) {
        throw new BlacklistError(JSON.stringify(currentConstraint), String(data));
    }
}

function whitelistValidation(currentConstraint, data) {
    let hasIllegalElements = true;
    for (let i = 0; i < currentConstraint.length && hasIllegalElements; i++) {
        if (data == currentConstraint) {
            hasIllegalElements = false;
        }
    }
    if (hasIllegalElements) {
        throw new WhitelistError(JSON.stringify(currentConstraint), String(data));
    }
}

function synchronousConstraintErrorHandling(synchronousConstraints, data) {
    for (let SCI of SCIA) {
        let currentConstraint = synchronousConstraints[SCI];
        if (currentConstraint != null) {
            switch (SCI) {
                case SCIM.jsType:
                    jsTypeValidation(currentConstraint, data);
                    break;
                case SCIM.dbType:
                    dbTypeValidation(currentConstraint, data);
                    break;
                case SCIM.blacklist:
                    blacklistValidation(currentConstraint, data);
                    break;
                case SCIM.whitelist:
                    whitelistValidation(currentConstraint, data);
                    break;
                default:
                    throw new SwitchFallThroughRuntimeError("synchronousConstraintErrorHandling", { switchArg: SCI, auxiliaryArgs: [data] });
            }
        }
    }
}

function validateQueryString(queryStringRequirements, queryStringObject) {
    for (let requiredProp of queryStringRequirements) {
        if (!queryStringObject.hasOwnProperty(requiredProp)) {
            throw new MissingQueryStringPropError(requiredProp, JSON.stringify(queryStringObject));
        }
    }
}

function validateRequiredReqBodyFields(notNullArray, requestData) {
    for (let requiredField of notNullArray) {
        if (!requestData.hasOwnProperty(requiredField)) {
            throw new MissingRequiredFieldError(
                JSON.stringify(notNullArray),
                JSON.stringify(requestData),
                requiredField
            );
        }
        else {
            let current = requestData[requiredField];
            if (current === null || current === "") {
                throw new InvalidRequiredFieldError(
                JSON.stringify(notNullArray),
                JSON.stringify(requestData),
                requiredField,
                JSON.stringify(current)
                );
            }
        }
    }
}

function validateSynchronousRequestData(Model, requestData) {
    for (let columnName of Model.columnNamesArray) {
        if (requestData.hasOwnProperty(columnName)) {
            synchronousConstraintErrorHandling(Model.synchronousConstraintSchema[columnName], requestData[columnName]);
        }
    }
}

class SynchronousErrorHandling {
    static SCIM = SCIM;

    static SCIA = SCIA;

    static dbTypesMap = dbTypesMap;

    static jsTypeValidation = jsTypeValidation;

    static dbTypeValidation = dbTypeValidation;

    static validateIntDbType = validateIntDbType;

    static validateVarcharDbType = validateVarcharDbType;

    static blacklistValidation = blacklistValidation;

    static whitelistValidation = whitelistValidation;

    static synchronousConstraintErrorHandling = synchronousConstraintErrorHandling;

    static validateQueryString = validateQueryString;

    static validateRequiredReqBodyFields = validateRequiredReqBodyFields;

    static validateSynchronousRequestData = validateSynchronousRequestData;
}

module.exports = SynchronousErrorHandling;