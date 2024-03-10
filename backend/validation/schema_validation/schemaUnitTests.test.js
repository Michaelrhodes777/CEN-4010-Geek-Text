const { ErrorsTestMap } = require('./Errors.js');
const { LogicTestMap } = require('./Logic.js');

describe("Schema Validation Errors have valid name prop", () => {
    let classNames = Object.keys(ErrorsTestMap);
    for (let classIdentifier of classNames) {
        let expected = classIdentifier;
        let actual = new ErrorsTestMap[classIdentifier]({}).name;
        test(`new ${classIdentifier}({}).name has is valid | ${expected} !== ${actual}`, () => {
            expect(expected === actual).toBe(true);
        });
    }
});

describe("Schema Validation Suite: Test points of failure", () => {
    const errorKeys = Object.keys(ErrorsTestMap);
    for (let key of errorKeys) {
        const ErrorClass = ErrorsTestMap[key];
        const { testPointsOfFailure } = ErrorClass;
        describe(`\n\t${key} Suite`, () => {
            for (let i = 0; i < testPointsOfFailure.length; i++) {
                let testingPayload = testPointsOfFailure[i];
                test(`\n\t\t${testingPayload.testName}\n\t\t${i}: logicFxn "${testingPayload.fxnName}()" to throw error on ${testingPayload.args.map((arg) => (`\n\t\t\t${String(arg)}`)).join("")}`, () => {
                    expect(() => testingPayload.runTest(LogicTestMap)).toThrow(ErrorClass);
                });
            }
        });
    }
});