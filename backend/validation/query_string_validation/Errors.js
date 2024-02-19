class QueryStringValidationError extends Error {
    static thisMapper(build, thisInstantiation) {
        for (let key of Object.keys(build)) {
            thisInstantiation[key] = build[key];
        }
    }

    constructor(message, errorPayload) {
        super("SchemaValidationError: " + message);
        this.isCustomError = true;
        this.customErrorType = "QueryStringValidationError";
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
        };

        QueryStringValidationError.thisMapper(build, this);
    }
}

class ErrorPayload {

    constructor() {
        this.mainArgs = null;
    }

    appendMainArgs(runtimeObject) {
        this.mainArgs = runtimeObject;
    }

}

class TestingPayload {
    
    constructor(testName, fxnName, args) {
        this.testName = testName;
        this.fxnName = fxnName;
        this.args = args;
        this.errorPayload = new ErrorPayload();
    }

    runTest(LogicFunctionsMap) {
        const { fxnName, args, errorPayload } = this;
        LogicFunctionsMap[fxnName](...args, errorPayload);
    }
}

class ReqDoesNotHaveQueryPropError extends QueryStringValidationError {
    static errorPayloadProps = [ "" ];

    static testPointsOfFailure = [
        new TestingPayload(
            "given that req.query === undefined, test should fail",
            "validateTablesReqQuery",
            [ {} ]
        )
    ];

    constructor(errorPayload) {
        super("req does not have query property", errorPayload);
        this.name = "ReqDoesNotHaveQueryPropError";
    }
}

class ReqQueryDoesNotHaveIdPropError extends QueryStringValidationError {
    static errorPayloadProps = [ "query" ];

    static testPointsOfFailure = [
        new TestingPayload(
            "given that req.query has no props, test should fail",
            "validateTablesReqQuery",
            [ { "query": {} } ]
        )
    ];

    constructor(errorPayload) {
        super("req.query does not have id property", errorPayload);
        this.name = "ReqQueryDoesNotHaveIdPropError";
    }
}

class ReqQueryDoesNotHaveCidOrQidPropError extends QueryStringValidationError {
    static errorPayloadProps = [ "query" ];

    static testPointsOfFailure = [
        new TestingPayload(
            "given that req.query does not have qid or cid prop, test should fail",
            "validateLinkingTablesReqQuery",
            [ { "query": { "id": null } } ]
        ),
        new TestingPayload(
            "given that req.query does not have qid or cid prop, test should fail",
            "validateLinkingTablesReqQuery",
            [ { "query": {} } ]
        )
    ];

    constructor(errorPayload) {
        super("req.query does not have id property", errorPayload);
        this.name = "ReqQueryDoesNotHaveCidOrQidPropError";
    }
}

req = {
    "query": {
        "id": "",
        "cid": ""
    },
    "body": {}
}

class ReqQueryHasMoreThanOnePropError extends QueryStringValidationError {
    static errorPayloadProps = [ "query" ];

    static testPointsOfFailure = [
        new TestingPayload(
            "given that req.query.length !== 1, test should fail",
            "validateTablesReqQuery",
            [ { "query": { "id": null, "cid": null } } ]
        ),
        new TestingPayload(
            "given that req.query.length !== 1, test should fail",
            "validateTablesReqQuery",
            [ { "query": { "id": null, "cid": null, "qid": null } } ]
        )
    ];

    constructor(errorPayload) {
        super("req.query has more than one prop", errorPayload);
        this.name = "ReqQueryHasMoreThanOnePropError";
    }
}

class ReqQueryIdIsNotArrayStringFormatError extends QueryStringValidationError {
    static errorPayloadProps = [ "idArray" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that idArray is "1,2,3", test should fail`,
            "validateStandardQueryString",
            [ { "query": { "id": "1,2,3"  } } ]
        ),
        new TestingPayload(
            `given that idArray is "1,2", test should fail`,
            "validateStandardQueryString",
            [ { "query": { "id": "1,2"  } } ]
        ),
        new TestingPayload(
            `given that idArray is "", test should fail`,
            "validateStandardQueryString",
            [ { "query": { "id": ""  } } ]
        ),
        new TestingPayload(
            `given that idArray is "[]", test should fail`,
            "validateStandardQueryString",
            [ { "query": { "id": "[]"  } } ]
        ),
        new TestingPayload(
            `given that idArray is "[1,2,3", test should fail`,
            "validateStandardQueryString",
            [ { "query": { "id": "[1,2,3"  } } ]
        ),
        new TestingPayload(
            `given that idArray is "1,2,3]", test should fail`,
            "validateStandardQueryString",
            [ { "query": { "id": "1,2,3]"  } } ]
        )
    ];
    
    constructor(errorPayload) {
        super("req.query.id does not start and close with brackets or has no ids", errorPayload);
        this.name = "ReqQueryIdIsNotArrayStringFormatError";
    }
}

class ReqQueryIdIsNotArrayError extends QueryStringValidationError {
    static errorPayloadProps = [ "req" ];


    constructor(errorPayload) {
        super("req.query.id/cid/qid is not an array", errorPayload);
        this.name = "ReqQueryIdIsNotArrayError";
    }
}

class ReqQueryArrayElementNaNError extends QueryStringValidationError {
    static errorPayloadProps = [ "query", "idArray" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that idArray is "[abc]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[abc]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[a]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[a]"  }]
        ),
        new TestingPayload(
            `given that idArray is "[a,b]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[a,b]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[a,b,c]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[a,b,c]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[1,a]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[1,a]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[1,2,3,a]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[1,2,3,a]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[abc]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[abc]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[abc,def]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[abc,def]"  } ]
        ),
    ];

    constructor(errorPayload) {
        super("req.query.id/cid/qid has elements which are NaN", errorPayload);
        this.name = "ReqQueryArrayElementNaNError";
    }

}

class ReqQueryArrayElementIsNotIntegerError extends QueryStringValidationError {
    static errorPayloadProps = [ "query", "idArray", "parsed" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that idArray is "[1.3]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[1.3]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[1.2,1.3]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[1.2,1.3]"  } ]
        )
    ];

    constructor(errorPayload) {
        super("req.query.id has element that is not an integer", errorPayload);
        this.name = "ReqQueryArrayElementIsNotIntegerError";
    }

}

class MultipleAllQueriesError extends QueryStringValidationError {
    static errorPayloadProps = [ "id" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that idArray is "[0,0]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[0,0]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[0,0,0]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[0,0,0]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[1,0]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[1,0]"  } ]
        ),
        new TestingPayload(
            `given that idArray is "[0,0]", test should fail`,
            "validateStandardQueryString",
            [ { "id": "[0,1]"  } ]
        )
    ];
    
    constructor(errorPayload) {
        super("id has multiple zeros", errorPayload);
        this.name = "MultipleAllQueriesError";
    }
}

class CidArrayModuloNotZeroError extends QueryStringValidationError {
    static errorPayloadProps = [ "cidArray", "numComposites", "modulo" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that Model.compositePkeys.length !== cidArray / divisor .length, test should fail`,
            "validateCidKeyArray",
            [ { "compositePkeys": [ "", "" ] }, "[1]" ]
        ),
        new TestingPayload(
            `given that Model.compositePkeys.length !== cidArray / divisor .length, test should fail`,
            "validateCidKeyArray",
            [ { "compositePkeys": [ "", "", "" ] }, "[1,2]" ]
        ),
        new TestingPayload(
            `given that Model.compositePkeys.length !== cidArray / divisor .length, test should fail`,
            "validateCidKeyArray",
            [ { "compositePkeys": [ "", "" ] }, "[1,2,3]" ]
        ),
        new TestingPayload(
            `given that Model.compositePkeys.length !== cidArray / divisor .length, test should fail`,
            "validateCidKeyArray",
            [ { "compositePkeys": [ "", "", "" ] }, "[1,2,3,4]" ]
        )
    ];

    constructor(errorPayload) {
        super("cid array length mod numComposites != 0", errorPayload);
        this.name = "CidArrayModuloNotZeroError";    
    }
}

class UnequalBodyKeyArraysLengthError extends QueryStringValidationError {
    static errorPayloadProps = [ "keyArrays", "body", "keyArraysLength", "bodyLength" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that body.length !== keyArrays.length, test should fail`,
            "validateBodyKeyArraysMatchingLength",
            [ [{}], [] ]
        ),
        new TestingPayload(
            `given that body.length !== keyArrays.length, test should fail`,
            "validateBodyKeyArraysMatchingLength",
            [ [{}, {}], [ [0] ] ]
        ),
        new TestingPayload(
            `given that body.length !== keyArrays.length, test should fail`,
            "validateBodyKeyArraysMatchingLength",
            [ [{}, {}, {}], [ [0], [1] ] ]
        )
    ];

    constructor(errorPayload) {
        super("keyArrays.length !== body.length", errorPayload);
        this.name = "UnequalBodyKeyArraysLengthError";
    }
}

class DuplicateIdKeyError extends QueryStringValidationError {
    static errorPayloadProps = [ "keyArrays", "keyArray", "queryStringIndex" ];

    static testPointsOfFailure = [
        new TestingPayload(
            `given that keyArrays is "[ [1], [1] ]", test should fail`,
            "validateNoDuplicateIds",
            [ [ [1], [1] ] ]
        ),
        new TestingPayload(
            `given that keyArrays is "[ [1], [2], [3], [3] ]", test should fail`,
            "validateNoDuplicateIds",
            [ [ [1], [2], [3], [3] ] ]
        ),
        new TestingPayload(
            `given that keyArrays is "[ [1, 1], [1, 1] ]", test should fail`,
            "validateNoDuplicateIds",
            [ [ [1, 1], [1, 1] ] ]
        ),
        new TestingPayload(
            `given that keyArrays is "[ [1, 1], [1, 2], [1, 3], [1, 3] ]", test should fail`,
            "validateNoDuplicateIds",
            [ [ [1, 1], [1, 2], [1, 3], [1, 3] ] ]
        ),
        new TestingPayload(
            `given that keyArrays is "[ [1, 1, 1], [1, 1, 2], [1, 1, 2] ]", test should fail`,
            "validateNoDuplicateIds",
            [ [ [1, 1, 1], [1, 1, 2], [1, 1, 2] ] ]
        )
    ];

    constructor(errorPayload) {
        super("idArray has duplicates", errorPayload);
        this.name = "DuplicateIdKeyError";
    }
}

const ErrorsTestMap = {
    ReqDoesNotHaveQueryPropError,
    ReqQueryDoesNotHaveIdPropError,
    ReqQueryDoesNotHaveCidOrQidPropError,
    ReqQueryHasMoreThanOnePropError,
    ReqQueryIdIsNotArrayStringFormatError,
    ReqQueryArrayElementNaNError,
    ReqQueryArrayElementIsNotIntegerError,
    MultipleAllQueriesError,
    CidArrayModuloNotZeroError,
    UnequalBodyKeyArraysLengthError,
    DuplicateIdKeyError
};

module.exports = {
    QueryStringValidationError,
    ErrorPayload,
    ReqDoesNotHaveQueryPropError,
    ReqQueryDoesNotHaveIdPropError,
    ReqQueryDoesNotHaveCidOrQidPropError,
    ReqQueryHasMoreThanOnePropError,
    ReqQueryIdIsNotArrayStringFormatError,
    ReqQueryArrayElementNaNError,
    ReqQueryArrayElementIsNotIntegerError,
    MultipleAllQueriesError,
    CidArrayModuloNotZeroError,
    UnequalBodyKeyArraysLengthError,
    DuplicateIdKeyError,
    ReqQueryIdIsNotArrayError, // purposefully not include in ErrorsTestMap due to unknown points of failure
    ErrorsTestMap
};