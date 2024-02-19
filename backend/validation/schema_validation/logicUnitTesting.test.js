const { ErrorPayload, InvalidJsTypeError, ErrorsTestMap } = require('./Errors.js');
const { Logic } = require('./Logic.js');
const { 
    jsTypeValidation,
    validateIntDbType,
    validateVarcharDbType,
    blacklistValidation,
    whitelistValidation,
    requireListValidation
} = Logic;


describe("jsTypeValidation Testing suite", () => {
    test("ErrorPayload throws correct error", () => {
        expect(() => jsTypeValidation("string", [], new ErrorPayload())).toThrow(InvalidJsTypeError);
    });
    test("ErrorPayload has correct propNames", () => {
        try {
            jsTypeValidation("string", [], new ErrorPayload());
        }
        catch (error) {
            for (let prop of InvalidJsTypeError.runtimeDataProps) {
                expect(error.mainArgs.hasOwnProperty(prop)).toBe(true);
            }
            console.log(error);
        }
    });

});