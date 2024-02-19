const {
    InvalidJsTypeError,
    IntNumberBoundsError,
    InvalidVarcharLengthError,
    BlacklistError,
    WhitelistError,
    RequiredListError,
} = require('./Errors.js');


class Logic {

    static jsTypeValidation(currentConstraint, data, errorPayload) {
        if (!(typeof data === currentConstraint)) {
            errorPayload.appendMainArgs({
                "data": String(data),
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
}

module.exports = {
    Logic
};