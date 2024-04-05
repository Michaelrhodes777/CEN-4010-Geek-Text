const supertest = require('supertest');
const createServer = require('../../util/createServer.js');
const { ModelIterable } = require('../../testing_utils/tables/Models.js');
const SchemaValidationErrors = require('../../validation/schema_validation/Errors.js');
const QueryStringValidationErrors = require('../../validation/query_string_validation/Errors.js');

const ERROR_TYPES = {
    "SchemaValidationErrors": "SchemaValidationErrors",
    "QueryStringValidationErrors": "QueryStringValidationErrors"
};

const ERROR_AGGREGATES = {
    "SchemaValidationErrors": SchemaValidationErrors.ErrorsTestMap,
    "QueryStringValidationErrors": QueryStringValidationErrors.ErrorsTestMap
};

class TestPayload {
    constructor(paramExtension, tableName, errorPayload, body = null) {
        this.testName = `${tableName}: given that paramExtension is "${paramExtension}", response object should contain the Error, ${errorPayload.identifier}`;
        this.url = `/${tableName}${paramExtension}`;
        this.errorPayload = errorPayload;
        this.body = body;
    }

    getTestingConsumables() {
        const { testName, url, errorPayload, body } = this;
        const { type, identifier } = errorPayload;
        const { statusCode, name: errorName } = new ERROR_AGGREGATES[type][identifier]({});
        return {
            testName,
            url,
            body,
            "expectConsumables": {
                statusCode,
                errorName
            }
        };
    }
}

const testPayloadConstructor = (tableName, Model) => [
    new TestPayload(
        "?id=[-1]&cid=[-1]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryHasMoreThanOnePropError" },
    ),
    new TestPayload(
        "?id=[-1]&qid=[-1]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryHasMoreThanOnePropError" },
    ),
    new TestPayload(
        "?id=[-1]&cid=[-1]&qid=[-1]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryHasMoreThanOnePropError" },
    ),
    new TestPayload(
        "?id=[1,1]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "DuplicateIdKeyError" },
        [{ [Model.idName]: -1 }, { [Model.idName]: -1 }]
    ),
    new TestPayload(
        "?id=[1.3]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryArrayElementIsNotIntegerError" }
    ),
    new TestPayload(
        "?id=[1.3,1.2]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryArrayElementIsNotIntegerError" }
    ),
    new TestPayload(
        "?id=[-1]",
        tableName,
        { type: ERROR_TYPES.SchemaValidationErrors,  identifier: "IntNumberBoundsError" }
    ),
    new TestPayload(
        "?id=[--1]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryArrayElementNaNError" }
    ),
    new TestPayload(
        "?id=[]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryIdIsNotArrayStringFormatError" }
    ),
    new TestPayload(
        "?id=[1,2,3",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryIdIsNotArrayStringFormatError" }
    ),
    new TestPayload(
        "?id=1,2,3]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryIdIsNotArrayStringFormatError" }
    ),
    new TestPayload(
        "?id=[0,0]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "MultipleAllQueriesError" }
    ),
    new TestPayload(
        "?id=[1,2,3,abc]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryArrayElementNaNError" }
    ),
    new TestPayload(
        "?id=[abc]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryArrayElementNaNError" }
    ),
    new TestPayload(
        "?id=[abc,def]",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryArrayElementNaNError" }
    ),
    new TestPayload(
        "?id=",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryIdIsNotArrayStringFormatError" }
    ),
    new TestPayload(
        "?id",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryIdIsNotArrayStringFormatError" }
    ),
    new TestPayload(
        "?",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryDoesNotHaveIdPropError" }
    ),
    new TestPayload(
        "",
        tableName,
        { type: ERROR_TYPES.QueryStringValidationErrors,  identifier: "ReqQueryDoesNotHaveIdPropError" }
    )
];

describe("GET: All table routes throw errors on invalid req.params", () => {
    for(let Model of ModelIterable) {
        const { tableName } = Model;
        let testPayloads = testPayloadConstructor(tableName, Model);
        for (let testPayload of testPayloads) {
            const { testName, url, expectConsumables } = testPayload.getTestingConsumables();
            const { statusCode, errorName } = expectConsumables;
            it(`\n\t${testName}`, async () => {
                const res = await supertest(createServer())
                    .get(url)
                    .expect(statusCode);
                expect(res.body.hasOwnProperty("response")).toBe(true);
                expect(res.body.response.hasOwnProperty("statusCode")).toBe(true);
                expect(res.body.response.statusCode === statusCode).toBe(true);
                expect(res.body.response.hasOwnProperty("name")).toBe(true);
                expect(res.body.response.name === errorName).toBe(true);
            });
        }
    }
});

describe("PUT: All table routes throw errors on invalid req.params", () => {
    for(let Model of ModelIterable) {
        const { tableName } = Model;
        let testPayloads = testPayloadConstructor(tableName, Model);
        for (let testPayload of testPayloads) {
            const { testName, url, body, expectConsumables } = testPayload.getTestingConsumables();
            const { statusCode, errorName } = expectConsumables;
            it(`\n\t${testName}`, async () => {
                const res = await supertest(createServer())
                    .put(url)
                    .send(body === null ? [{ [Model.idName]: -1}] : body)
                    .expect(statusCode);
                expect(res.body.hasOwnProperty("response")).toBe(true);
                expect(res.body.response.hasOwnProperty("statusCode")).toBe(true);
                expect(res.body.response.statusCode === statusCode).toBe(true);
                expect(res.body.response.hasOwnProperty("name")).toBe(true);
                expect(res.body.response.name === errorName).toBe(true);
            });
        }
    }
});

describe("DELETE: All table routes throw errors on invalid req.params", () => {
    for(let Model of ModelIterable) {
        const { tableName } = Model;
        let testPayloads = testPayloadConstructor(tableName, Model);
        for (let testPayload of testPayloads) {
            const { testName, url, expectConsumables } = testPayload.getTestingConsumables();
            const { statusCode, errorName } = expectConsumables;
            it(`\n\t${testName}`, async () => {
                const res = await supertest(createServer())
                    .delete(url)
                    .expect(statusCode);
                expect(res.body.hasOwnProperty("response")).toBe(true);
                expect(res.body.response.hasOwnProperty("statusCode")).toBe(true);
                expect(res.body.response.statusCode === statusCode).toBe(true);
                expect(res.body.response.hasOwnProperty("name")).toBe(true);
                expect(res.body.response.name === errorName).toBe(true);
            });
        }
    }
});