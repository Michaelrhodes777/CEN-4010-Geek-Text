const ModelInterface = require('./ModelInterface.js');
const { Models, ModelIterable } = require('../../testing_utils/tables/Models.js');

const { staticProps: PROPS } = ModelInterface;
const propsCheck = [
    "modelName",
    "tableName",
    "columnNamesMap",
    "columnNamesArray",
    "idName",
    "notNullArray",
    "updateableColumns",
    "synchronousConstraintSchema",
    "asynchronousConstraintSchema"
];

test(`ModelInterface should have all correct props`, () => {
    expect(propsCheck.length === Object.keys(PROPS).length).toBe(true);
    for (let propName of propsCheck) {
        expect(PROPS.hasOwnProperty(propName)).toBe(true);
    }
    for (let key of Object.keys(PROPS)) {
        expect(PROPS[key] === key).toBe(true);
    }
});

describe(`Check Models has valid static ${PROPS.modelName} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a tableName prop`, () => {
            expect(Model.hasOwnProperty(PROPS.modelName)).toBe(true);
        });
        test(`${Model.modelName} should have a tableName prop of js type "string"`, () => {
            expect(typeof Model.modelName === "string").toBe(true);
        });
        test(`${Model.modelName} should have a tableName prop of length > 0`, () => {
            expect(Model.modelName.length > 0).toBe(true);
        });
        test(`${Model.modelName} should have correct modelName definition`, () => {
            expect(Models[Model.modelName] === Model).toBe(true);
        });
    }
});

describe(`Check Models has valid static ${PROPS.tableName} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a tableName prop`, () => {
            expect(Model.hasOwnProperty(PROPS.tableName)).toBe(true);
        });
        test(`${Model.modelName} should have a tableName prop of js type "string"`, () => {
            expect(typeof Model.tableName === "string").toBe(true);
        });
        test(`${Model.modelName} should have a tableName prop of length > 0`, () => {
            expect(Model.tableName.length > 0).toBe(true);
        });
    }
});

describe(`Check Models has valid static ${PROPS.columnNamesMap} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.columnNamesMap} prop`, () => {
            expect(Model.hasOwnProperty(PROPS.columnNamesMap)).toBe(true);
        });
        test(`${Model.modelName} has a ${PROPS.columnNamesMap} that is js type "object" and fails Array.isArray() check`, () => {
            expect(typeof Model.columnNamesMap === "object").toBe(true);
            expect(Array.isArray(Model.columnNamesMap)).toBe(false);
        });
        test(`${Model.modelName} should have a ${PROPS.columnNamesMap} prop that has the same number of elements as the ${PROPS.columnNamesArray} prop`, () => {
            expect(Object.keys(Model.columnNamesMap).length === Model.columnNamesArray.length).toBe(true);
        });
        test(`${Model.modelName}'s ${PROPS.columnNamesMap} prop has valid self-reference`, () => {
            for (let key of Object.keys(Model.columnNamesMap)) {
                expect(key === Model.columnNamesMap[key]).toBe(true);
            }
        });
    }
});

describe(`Check Models has valid static ${PROPS.columnNamesArray} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.columnNamesArray} prop`, () => {
            expect(Model.hasOwnProperty(PROPS.columnNamesArray)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.columnNamesArray} prop that passes Array.isArray() test`, () => {
            expect(Array.isArray(Model.columnNamesArray)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.columnNamesArray} prop that has the same elements as the ${PROPS.columnNamesMap} prop`, () => {
            for (let columnName of Model.columnNamesArray) {
                expect(columnName === Model.columnNamesMap[columnName]).toBe(true);
            }
        });
    }
});

describe(`Check Models has valid static ${PROPS.idName} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a idName prop`, () => {
            expect(Model.hasOwnProperty(PROPS.idName)).toBe(true);
        });
        test(`${Model.modelName} should have a idName prop of js type "string"`, () => {
            expect(typeof Model.idName === "string").toBe(true);
        });
        test(`${Model.modelName} should have a idName prop of length > 0`, () => {
            expect(Model.idName.length > 0).toBe(true);
        });
    }
});

describe(`Check Models has valid static ${PROPS.notNullArray} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.notNullArray} prop`, () => {
            expect(Model.hasOwnProperty(PROPS.notNullArray)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.notNullArray} prop that passes Array.isArray() test`, () => {
            expect(Array.isArray(Model.notNullArray)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.notNullArray} prop that has no more elements than are present in the ${PROPS.columnNamesArray} prop`, () => {
            expect(Model.notNullArray.length <= Model.columnNamesArray.length).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.notNullArray} prop where each element is defined and not null`, () => {
            for (let prop of Model.notNullArray) {
                expect(prop !== undefined && prop !== null).toBe(true);
            }
        });
    }
});

describe(`Check Models has valid static ${PROPS.updateableColumns} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.updateableColumns} prop`, () => {
            expect(Model.hasOwnProperty(PROPS.updateableColumns)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.updateableColumns} prop that passes Array.isArray() test`, () => {
            expect(Array.isArray(Model.updateableColumns)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.updateableColumns} prop that has no more elements than are present in the ${PROPS.columnNamesArray} prop`, () => {
            expect(Model.updateableColumns.length <= Model.columnNamesArray.length).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.updateableColumns} prop where each element is defined and not null`, () => {
            for (let prop of Model.updateableColumns) {
                expect(prop !== undefined && prop !== null).toBe(true);
            }
        });        
    }
});