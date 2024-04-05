const ModelLTInterface = require('./ModelLTInterface.js');
const { Models, ModelIterable } = require('../../testing_utils/linking_tables/Models.js');

const propsCheck = [
    "modelName",
    "tableName",
    "columnNamesMap",
    "compositePkeys",
    "columnNamesArray",
    "queryablePkey",
    "notNullArray",
    "updateableColumns",
    "synchronousConstraintSchema",
    "asynchronousConstraintSchema"
];
const { staticProps: PROPS } = ModelLTInterface;

test(`ModelLTInterface should have all correct props`, () => {
    expect(propsCheck.length === Object.keys(PROPS).length).toBe(true);
    for (let propName of propsCheck) {
        expect(PROPS.hasOwnProperty(propName)).toBe(true);
    }
    for (let key of Object.keys(PROPS)) {
        expect(PROPS[key] === key).toBe(true);
    }
});

describe(`Check LT Models has valid static ${PROPS.modelName} prop`, () => {
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

describe(`Check LT Models has valid static ${PROPS.tableName} prop`, () => {
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

describe(`Check LT Models has valid static ${PROPS.columnNamesMap} prop`, () => {
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

describe(`Check LT Models has valid static ${PROPS.columnNamesArray} prop`, () => {
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

describe(`Check LT Models has valid  static ${PROPS.compositePkeys} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.compositePkeys} prop`, () => {
            expect(Model.hasOwnProperty(PROPS.compositePkeys)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.compositePkeys} prop that passes Array.isArray() test`, () => {
            expect(Array.isArray(Model.compositePkeys)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.compositePkeys} prop that has at least two elements`, () => {
            expect(Model.compositePkeys.length >= 2).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.compositePkeys} prop that has no more than the elements are present in the ${PROPS.columnNamesArray} prop`, () => {
            expect(Model.compositePkeys.length <= Model.columnNamesArray.length).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.compositePkeys} prop where each element is defined and not null`, () => {
            for (let pkey of Model.compositePkeys) {
                expect(pkey !== undefined && pkey !== null).toBe(true);
            }
        });
    }
});

describe(`Check LT Models has valid static ${PROPS.queryablePkey} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.queryablePkey} prop`, () => {
            expect(Model.hasOwnProperty(PROPS.queryablePkey)).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.queryablePkey} prop that is defined`, () => {
            expect(Model.queryablePkey !== undefined).toBe(true);
        });
        test(`${Model.modelName} should have a ${PROPS.queryablePkey} prop that is js type "string"`, () => {
            expect(typeof Model.queryablePkey === "string").toBe(true);
        });
    }
});

describe(`Check LT Models has valid static ${PROPS.notNullArray} prop`, () => {
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

describe(`Check LT Models has valid static ${PROPS.updateableColumns} prop`, () => {
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