const ModelLTInterface = require('./ModelLTInterface.js');
const BooksWishlistsLTModel = require('./books_wishlists_lt/BooksWishlistsLTModel.js');
const ShoppingCartsLTModel = require('./shopping_carts_lt/ShoppingCartsLTModel.js');
const SchemaValidation = require('../../validation/schema_validation/SchemaValidation.js');
const DatabaseValidation = require('../../validation/database_validation/DatabaseVAlidation.js');

const ModelIterable = [
    BooksWishlistsLTModel,
    ShoppingCartsLTModel
];

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

function stringConstructor(Model, message) {
    return ` ${message}`;
}

test(`${Model.modelName} should`, () => {
    expect(true).tobe(true);
});

test(`ModelLTInterface should have all correct props`, () => {
    expect(propsCheck.length === PROPS.length).toBe(true);
    for (let propName of propsCheck) {
        expect(PROPS.hasOwnProperty(propName)).toBe(true);
    }
    for (let key of Object.keys(PROPS)) {
        expect(ModelLTInterface[key] === key).toBe(true);
    }
});

describe(`Check LT Models has valid static ${PROPS.tableName} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a tableName prop`, () => {});
        test(`${Model.modelName} should have a tableName prop of js type "string"`, () => {});
        test(`${Model.modelName} should have a tableName prop of length > 0`, () => {});
        test(`${Model.modelName} should have correct naming convention, that is modelName prop can be converted from PascalCase to snake_case`, () => {});
    }
});

describe(`Check LT Models has valid static ${PROPS.columnNamesMap} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.columnNamesMap} prop`, () => {});
        test(`${Model.modelName} has a ${PROPS.columnNamesMap} that is js type "object" and fails Array.isArray() check`, () => {});
        test(`${Model.modelName} should have a ${PROPS.columnNamesMap} prop that has the same number of elements as the ${PROPS.columnNamesArray} prop`, () => {});
        test(`${Model.modelName}'s ${PROPS.columnNamesMap} prop has valid self-reference`, () => {});
    }
});

describe(`Check LT Models has valid static ${PROPS.columnNamesArray} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.columnNamesArray} prop`, () => {});
        test(`${Model.modelName} should have a ${PROPS.columnNamesArray} prop that passes Array.isArray() test`, () => {});
        test(`${Model.modelName} should have a ${PROPS.columnNamesArray} prop that has the same elements as the ${PROPS.columnNamesMap} prop`, () => {});
    }
});

describe(`Check LT Models has valid  static ${PROPS.compositePkeys} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.compositePkeys} prop`, () => {});
        test(`${Model.modelName} should have a ${PROPS.compositePkeys} prop that passes Array.isArray() test`, () => {});
        test(`${Model.modelName} should have a ${PROPS.compositePkeys} prop that has at least two elements`, () => {});
        test(`${Model.modelName} should have a ${PROPS.compositePkeys} prop that has no more than the elements are present in the ${PROPS.columnNamesArray} prop`, () => {});
        test(`${Model.modelName} should have a ${PROPS.compositePkeys} prop where each element is defined and not null`, () => {});
    }
});

describe(`Check LT Models has valid static ${PROPS.queryablePkey} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.queryablePkey} prop`, () => {});
        test(`${Model.modelName} should have a ${PROPS.queryablePkey} prop that is defined`, () => {});
        test(`${Model.modelName} should have a ${PROPS.queryablePkey} prop that is js type "string"`, () => {});
    }
});

describe(`Check LT Models has valid static ${PROPS.notNullArray} prop`, () => {
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.notNullArray} prop`, () => {});
        test(`${Model.modelName} should have a ${PROPS.notNullArray} prop that passes Array.isArray() test`, () => {});
        test(`${Model.modelName} should have a ${PROPS.notNullArray} prop that has no more elements than are present in the ${PROPS.columnNamesArray} prop`, () => {});
        test(`${Model.modelName} should have a ${PROPS.notNullArray} prop where each element is defined and not null`, () => {});
    }
});

describe(`Check LT Models has valid static ${PROPS.updateableColumns} prop`, () => {
    for (let Model of ModelIterable) {}
});

// Add tests to verify the state of the synchronousConstraintSchema props
describe(`Check LT Models has valid static ${PROPS.synchronousConstraintSchema} prop`, () => {
    const { propsArray } = SchemaValidation;
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.synchronousConstraintSchema} prop`, () => {});
        test(`${Model.modelName} should have ${PROPS.synchronousConstraintSchema} prop that has same number of elements as ${PROPS.columnNamesArray} prop`, () => {});
        test(`${Model.modelName} should have ${PROPS.synchronousConstraintSchema} prop that has objects with all elements present in "propsArray"`, () => {}); 
    }
});

// Add tests to verify the state of the asynchronousConstraintSchema props
describe(`Check LT Models has valid static ${PROPS.asynchronousConstraintSchema} prop`, () => {
    const { propsArray } = DatabaseValidation;
    for (let Model of ModelIterable) {
        test(`${Model.modelName} should have a static ${PROPS.asynchronousConstraintSchema} prop`, () => {});
        test(`${Model.modelName} should have ${PROPS.asynchronousConstraintSchema} prop that has same number of elements as ${PROPS.columnNamesArray} prop`, () => {});
        test(`${Model.modelName} should have ${PROPS.asynchronousConstraintSchema} prop that has objects with all elements present in "propsArray"`, () => {}); 
    }
});