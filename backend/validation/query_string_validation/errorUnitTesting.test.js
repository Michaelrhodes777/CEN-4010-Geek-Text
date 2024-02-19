const { ErrorsTestMap } = require('./Errors.js');
const { LogicTestMap } = require('./Logic.js');

describe("Query String Errors have valid name Testing Suite", () => {
    let classNames = Object.keys(ErrorsTestMap);
    for (let classIdentifier of classNames) {
        test("new ErrorClass({}).name has valid name", () => {
            expect(classIdentifier === new ErrorsTestMap[classIdentifier]({}).name).toBe(true);
        });
    }
});

describe("Automated Error test suite", () => {
    const errorPropNames = Object.keys(ErrorsTestMap);
    for (let errorPropName of errorPropNames) {
        describe(errorPropName + ": ", () => {
            const ErrorClass = ErrorsTestMap[errorPropName];
            for (let expectedFailureTestCase of ErrorClass.testPointsOfFailure) {
                test(errorPropName + ": " + expectedFailureTestCase.testName, () => {
                    expect(() => expectedFailureTestCase.runTest(LogicTestMap)).toThrow(ErrorClass);
                });
            }
        });
    }
});