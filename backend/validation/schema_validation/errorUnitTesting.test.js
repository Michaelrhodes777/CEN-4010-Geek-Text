const { ErrorsTestMap } = require('./Errors.js');

describe("Schema Validation Errors have valid name Testing Suite", () => {
    let classNames = Object.keys(ErrorsTestMap);
    for (let classIdentifier of classNames) {
        test("new ErrorClass({}).name has valid name", () => {
            expect(classIdentifier === new ErrorsTestMap[classIdentifier]({}).name).toBe(true);
        });
    }
});