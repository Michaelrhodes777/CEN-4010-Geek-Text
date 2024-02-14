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
    IdArrayHasZeroLengthError,
    AllQueryAndBodyError,
    InvalidPrimaryKeyError,
    UniquenessError,
    SwitchFallThroughRuntimeError
} = require('../../routes/tables/controllerErrors.js');
const request = require('supertest');
const app = require('../../util/createServer.js')();

function errorHandlingTestSuite(tableName) {
    it(`should return all ${tableName}`, async () => {
        await request(app)
            .get(`/${tableName}?id=[0]`)
            .expect(200);
    });

    it(`should return ReqDoesNotHaveQueryPropError on path extension "?"`, async () => {
        const pathExtensions = [ "", "?" ];
        for (let pathExtension of pathExtensions) {
            const res = await request(app)
                .get(`/${tableName}${pathExtension}`);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("response");
            const responseBody = res.body.response;
            expect(responseBody).toHaveProperty("name");
            expect(responseBody).toHaveProperty("statusCode");
            expect(responseBody.name).toBe("ReqQueryDoesNotHaveIdPropError");
            expect(responseBody.statusCode).toBe(400);
        }
    });

    it(`should return ReqQueryIdIsNotArrayStringFormatError`, async () => {
        const basePathExtension = "?id=";
        const pathExtensions = [ "0", "1", "abc", "a", "-1", "123" ];
        for (let pathExtension of pathExtensions) {
            const res = await request(app)
                .get(`/${tableName}${basePathExtension}${pathExtension}`);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("response");
            const responseBody = res.body.response;
            expect(responseBody).toHaveProperty("name");
            expect(responseBody).toHaveProperty("statusCode");
            expect(responseBody.name).toBe("ReqQueryIdIsNotArrayStringFormatError");
            expect(responseBody.statusCode).toBe(400);
        }
    });

    it(`should return ReqQueryArrayElementNaNError`, async () => {
        const basePathExtension = "?id=";
        const pathExtensions = [ "[a]", "[ab]", "[abc]" ];
        for (let pathExtension of pathExtensions) {
            const res = await request(app)
                .get(`/${tableName}${basePathExtension}${pathExtension}`);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("response");
            const responseBody = res.body.response;
            const parsed = JSON.parse(responseBody.id)
            console.log(parsed);
            console.log(typeof parsed);
            expect(responseBody).toHaveProperty("name");
            expect(responseBody).toHaveProperty("statusCode");
            expect(responseBody.name).toBe("ReqQueryArrayElementNaNError");
            expect(responseBody.statusCode).toBe(400);
        }
    });

    it(`should return MulitpleAllQueriesError on mulitple all queries`, async () => {
        const basePathExtension = "?id=";
        const pathExtensions = [ "[0,0]", "[0,0,0]", "[0,0,0,0]" ];
        for (let pathExtension of pathExtensions) {
            const res = await request(app)
                .get(`/${tableName}${basePathExtension}${pathExtension}`);
            expect(res.status).toBe(400);
            const responseBody = res.body.response;
            expect(responseBody).toHaveProperty("name");
            expect(responseBody).toHaveProperty("statusCode");
            expect(responseBody.name).toBe("MultipleAllQueriesError");
            expect(responseBody.statusCode).toBe(400);
        }
    });

    it(`should return ReqQueryArrayElementIsNotIntegerError`, async () => {
        const basePathExtension = "?id=";
        const pathExtensions = [ "[1.3]", "[1.4,1902.2]" ];
        for (let pathExtension of pathExtensions) {
            const res = await request(app)
                .get(`/${tableName}${basePathExtension}${pathExtension}`);
            const responseBody = res.body.response;
            console.log(responseBody);
            expect(res.status).toBe(400);
            expect(responseBody).toHaveProperty("name");
            expect(responseBody).toHaveProperty("statusCode");
            expect(responseBody.name).toBe("ReqQueryArrayElementIsNotIntegerError");
            expect(responseBody.statusCode).toBe(400);
        }  
    });

    it(`should return IntNumberBoundsError`, async () => {
        const basePathExtension = "?id=";
        const pathExtensions = [ "[-1]", "[-2]", "[-1,-2]" ];
        for (let pathExtension of pathExtensions) {
            const res = await request(app)
                .get(`/${tableName}${basePathExtension}${pathExtension}`);
            const responseBody = res.body.response;
            console.log(responseBody);
            expect(res.status).toBe(400);
            expect(responseBody).toHaveProperty("name");
            expect(responseBody).toHaveProperty("statusCode");
            expect(responseBody.name).toBe("IntNumberBoundsError");
            expect(responseBody.statusCode).toBe(400);
        }
    });
}

describe("GET /authors", function() {
    it("should return all authors", async () => {
    await request(app)
        .get("/authors?id=[0]")
        .expect(200);
    });
});

describe("GET /users", () => errorHandlingTestSuite("users"));
describe("GET /authors", () => errorHandlingTestSuite("authors"));
describe("GET /books", () => errorHandlingTestSuite("books"));