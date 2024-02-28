const TestingPayload = require('../TestingPayload.js');

class SchemaValidationError extends Error {
    static thisMapper(build, thisInstantiation) {
        for (let key of Object.keys(build)) {
            thisInstantiation[key] = build[key];
        }
    }

    constructor(message, errorPayload) {
        super("SchemaValidationError: " + message);
        this.isCustomError = true;
        this.customErrorType = "SchemaValidationError";
        this.statusCode = 400;
        this.responseMessage = "Malformed Data";
        this.mainArgs = null;
        this.auxArgs = null;
        this.name = null;
        this.iterationIndex = null;
        this.controllerType = null;
        this.loggingPayload = null;
        this.name = null;

        const build = {
            mainArgs: errorPayload.mainArgs,
            iterationIndex: errorPayload.iterationIndex
        };

        SchemaValidationError.thisMapper(build, this);
    }
}

class MissingRequiredFieldError extends SchemaValidationError {

    static runtimeDataProps = [ "notNullArray", "requestData", "requiredField" ];

    constructor(errorPayload) {
        super("requestData does not have the required fields", errorPayload);
        this.name = "MissingRequiredFieldError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidRequiredFieldError extends SchemaValidationError {

    static runtimeDataProps = [ "notNullArray", "requestData", "requiredField", "current" ];

    constructor(errorPayload) {
        super("request data field is malformed", errorPayload);
        this.name = "InvalidRequiredFieldError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidJsTypeError extends SchemaValidationError {

    static runtimeDataProps = [ "data", "expectedType", "actualType" ];

    static testPointsOfFailure = [
        new TestingPayload(
            "given that expected js type is string and paramter is 1, test should fail",
            "jsTypeValidation",
            [ "string", 1 ]
        ),
        new TestingPayload(
            "given that expected js type is string and paramter is {}, test should fail",
            "jsTypeValidation",
            [ "string", {} ]
        ),
        new TestingPayload(
            "given that expected js type is string and paramter is [], test should fail",
            "jsTypeValidation",
            [ "string", [] ]
        ),
        new TestingPayload(
            "given that expected js type is number and paramter is \"1\", test should fail",
            "jsTypeValidation",
            [ "number", "1" ]
        ),
        new TestingPayload(
            "given that expected js type is number and paramter is {}, test should fail",
            "jsTypeValidation",
            [ "number", {} ]
        ),
        new TestingPayload(
            "given that expected js type is number and paramter is [], test should fail",
            "jsTypeValidation",
            [ "number", [] ]
        )
    ];

    constructor(errorPayload) {
        super("request data field is malformed", errorPayload);
        this.name = "InvalidJsTypeError";
        this.responseMessage = "Malformed data";
    }
}

class IntNumberBoundsError extends SchemaValidationError {

    static runtimeDataProps = [ "bounds", "data" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that bounds is [ "[", 1, "i", "-" ] and data is 0, test should fail`,
            "validateIntDbType",
            [ [ "[", 1, "i", "-" ], 0 ]
        ),
        new TestingPayload(
            `given that bounds is [ "(", 1, "i", "-" ]  and data is 1, test should fail`,
            "validateIntDbType",
            [ [ "(", 1, "i", "-" ], 1 ]
        ),
        new TestingPayload(
            `given that bounds is [ "-", "i", 0, "]" ]  and data is 1, test should fail`,
            "validateIntDbType",
            [ [ "-", "i", 0, "]" ], 1 ]
        ),
        new TestingPayload(
            `given that bounds is [ "-", "i", 0, ")" ] and data is 0, test should fail`,
            "validateIntDbType",
            [ [ "-", "i", 0, ")" ], 0 ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 10, 11, "]" ] and data is 12, test should fail`,
            "validateIntDbType",
            [ [ "[", 10, 11, "]" ], 12 ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 10, 11, "]" ] and data is 9, test should fail`,
            "validateIntDbType",
            [ [ "[", 10, 11, "]" ], 9 ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 10, 10, "]" ] and data is 11, test should fail`,
            "validateIntDbType",
            [ [ "[", 10, 10, "]" ], 11 ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 10, 10, "]" ] and data is 9, test should fail`,
            "validateIntDbType",
            [ [ "[", 10, 10, "]" ], 9 ]
        )
    ];

    constructor(errorPayload) {
        super("integer database data type is not within proper constraints", errorPayload);
        this.name = "IntNumberBoundsError";
        this.responseMessage = "Malformed data";
    }
}

class InvalidVarcharLengthError extends SchemaValidationError {

    static runtimeDataProps = [ "bounds", "data" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that bounds is [ "[", 1, "i", "-" ] and data is "", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "[", 1, "i", "-" ], "" ]
        ),
        new TestingPayload(
            `given that bounds is [ "(", 1, "i", "-" ]  and data is "a", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "(", 1, "i", "-" ], "a" ]
        ),
        new TestingPayload(
            `given that bounds is [ "(", 1, "i", "-" ]  and data is "", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "(", 1, "i", "-" ], "" ]
        ),
        new TestingPayload(
            `given that bounds is [ "-", "i", 2, "]" ]  and data is "abc", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "-", "i", 2, "]" ], "abc" ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 5, 6, "]" ] and data is "abcd", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "[", 10, 11, "]" ], "abcd" ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 5, 6, "]" ] and data is "abcdefg", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "[", 5, 6, "]" ], "abcdefg" ]
        ),
        new TestingPayload(
            `given that bounds is [ "(", 5, 6, "]" ] and data is "abcde", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "(", 5, 6, "]" ], "abcde" ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 5, 6, ")" ] and data is "abcdef", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "[", 5, 6, ")" ], "abcdef" ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 5, 6, "]" ] and data is "", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "[", 5, 6, "]" ], "" ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 5, 6, "]" ] and data is "", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "[", 5, 6, "]" ], "" ]
        ),
        new TestingPayload(
            `given that bounds is [ "(", 5, 6, "]" ] and data is "", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "(", 5, 6, "]" ], "" ]
        ),
        new TestingPayload(
            `given that bounds is [ "[", 5, 6, ")" ] and data is "", an InvalidVarcharLengthError should be thrown`,
            "validateVarcharDbType",
            [ [ "[", 5, 6, ")" ], "" ]
        )
    ];

    constructor(errorPayload) {
        super("varchar database data type is not within proper constraints", errorPayload);
        this.name = "InvalidVarcharLengthError";
        this.responseMessage = "Malformed data";
    }
}

const {
    numeric,
    lowercase,
    uppercase,
    alphabetical,
    alphanumeric,
    specialCharacters,
    datestampWhitelist,
    stdBlacklist
} = require('../../routes/StandardLists.js');
class BlacklistError extends SchemaValidationError {

    static runtimeDataProps = [ "blacklist", "data" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that the blacklist is numeric and data is "a1234", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ numeric, "a1234", ]
        ),
        new TestingPayload(
            `given that the blacklist is numeric and data is "1234a", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ numeric, "1234a", ]
        ),
        new TestingPayload(
            `given that the blacklist is numeric and data is "12a34", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ numeric, "12a34", ]
        ),
        new TestingPayload(
            `given that the blacklist is numeric and data is "a", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ numeric, "a", ]
        ),
        new TestingPayload(
            `given that the blacklist is lowercase and data is "abcd1", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ lowercase, "abcd1", ]
        ),
        new TestingPayload(
            `given that the blacklist is lowercase and data is "1abcd", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ lowercase, "1abcd", ]
        ),
        new TestingPayload(
            `given that the blacklist is lowercase and data is "ab1cd", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ lowercase, "ab1cd", ]
        ),
        new TestingPayload(
            `given that the blacklist is lowercase and data is "1", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ lowercase, "1", ]
        ),
        new TestingPayload(
            `given that the blacklist is stdBlacklist and data is "\"abcd", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ stdBlacklist, "\"abcd" ]
        ),
        new TestingPayload(
            `given that the blacklist is stdBlacklist and data is "\'abcd", a BlacklistError should be thrown`,
            "blacklistValidation",
            [ stdBlacklist, "\'abcd" ]
        ),
        new TestingPayload(
            `given that the blacklist is stdBlacklist and data is "\\abcd", a BlacklistError should be thrown`,
            "blacklistValidation",
            [stdBlacklist, "\\abcd" ]
        ),
        new TestingPayload(
            `given that the blacklist is stdBlacklist and data is "/abcd", a BlacklistError should be thrown`,
            "blacklistValidation",
            [stdBlacklist, "/abcd" ]
        )
    ];

    constructor(errorPayload) {
        super("data includes blacklisted elements", errorPayload);
        this.name = "BlacklistError";
        this.responseMessage = "Malformed data";
    }
}

class WhitelistError extends SchemaValidationError {

    static runtimeDataProps = [ "blacklist", "data", "constraintFailures" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that the whitelist is lowercase and data is "abcd1", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ lowercase, "abcd1", ]
        ),
        new TestingPayload(
            `given that the whitelist is lowercase and data is "1abcd", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ lowercase, "1abcd", ]
        ),
        new TestingPayload(
            `given that the whitelist is lowercase and data is "ab1cd", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ lowercase, "ab1cd", ]
        ),
        new TestingPayload(
            `given that the whitelist is lowercase and data is "1", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ lowercase, "1", ]
        ),
        new TestingPayload(
            `given that the whitelist is alphabetical and data is "josh9", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ alphabetical, "josh9", ]
        ),
        new TestingPayload(
            `given that the whitelist is alphanumeric and data is "josh9!", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ alphanumeric, "josh9!", ]
        ),
        new TestingPayload(
            `given that the whitelist is datestampWhitelist and data is " 12-12-24:00-00-00", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ datestampWhitelist, " 12-12-24:00-00-00", ]
        ),
        new TestingPayload(
            `given that the whitelist is datestampWhitelist and data is "12-12-24:00-00-00 ", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ datestampWhitelist, "12-12-24:00-00-00 ", ]
        ),
        new TestingPayload(
            `given that the whitelist is datestampWhitelist and data is "12/12/24:00-00-00", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ datestampWhitelist, "12/12/24:00-00-00", ]
        ),
        new TestingPayload(
            `given that the whitelist is datestampWhitelist and data is "1.2-12-24:00-00-00", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ datestampWhitelist, "1.2-12-24:00-00-00", ]
        ),
        new TestingPayload(
            `given that the whitelist is datestampWhitelist and data is "January 1st, 2001", a WhitelistError should be thrown`,
            "whitelistValidation",
            [ datestampWhitelist, "January 1st, 2001", ]
        )
    ];

    constructor(errorPayload) {
        super("data includes blacklisted elements", errorPayload);
        this.name = "WhitelistError";
        this.responseMessage = "Malformed data";
    }
}

class RequiredListError extends SchemaValidationError {

    static runTimeDataProps = [ "lists", "index", "data" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that the required list is [ numeric, lowercase, uppercase, specialCharacters ] and the data is "Allstar!", a RequiredListError should be thrown`,
            "requiredListValidation",
            [ [ numeric, lowercase, uppercase, specialCharacters ], "Allstar!" ]
        ),
        new TestingPayload(
            `given that the required list is [ numeric, lowercase, uppercase, specialCharacters ] and the data is "All777!", a RequiredListError should be thrown`,
            "requiredListValidation",
            [ [ numeric, lowercase, uppercase, specialCharacters ], "All777!" ]
        ),
        new TestingPayload(
            `given that the required list is [ numeric, lowercase, uppercase, specialCharacters ] and the data is "ll777!", a RequiredListError should be thrown`,
            "requiredListValidation",
            [ [ numeric, lowercase, uppercase, specialCharacters ], "ll777!" ]
        ),
        new TestingPayload(
            `given that the required list is [ numeric, lowercase, uppercase, specialCharacters ] and the data is "Allstar777", a RequiredListError should be thrown`,
            "requiredListValidation",
            [ [ numeric, lowercase, uppercase, specialCharacters ], "Allstar777" ]
        )
    ];
    
    constructor(errorPayload) {
        super("data does not contain atleast one element from each list", errorPayload);
        this.name = "RequiredListError";
        this.responseMessage = "Malformed data";
    }
}

const ErrorsTestMap = {
    "MissingRequiredFieldError": MissingRequiredFieldError,
    "InvalidRequiredFieldError": InvalidRequiredFieldError,
    "InvalidJsTypeError": InvalidJsTypeError,
    "IntNumberBoundsError": IntNumberBoundsError,
    "InvalidVarcharLengthError": InvalidVarcharLengthError,
    "BlacklistError": BlacklistError,
    "WhitelistError": WhitelistError,
    "RequiredListError": RequiredListError
};

module.exports = {
    SchemaValidationError,
    MissingRequiredFieldError,
    InvalidRequiredFieldError,
    InvalidJsTypeError,
    IntNumberBoundsError,
    InvalidVarcharLengthError,
    BlacklistError,
    WhitelistError,
    RequiredListError,
    ErrorsTestMap
};