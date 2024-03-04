const DatabaseControl = require('../../testing_utils/DatabaseControl.js');

const authorsBase = require('../../testing_utils/tables/authors/authorsBase.js');
const publishersBase = require('../../testing_utils/tables/publishers/publishersBase.js');
const genresBase = require('../../testing_utils/tables/genres/genresBase.js');
const booksBase = require('../../testing_utils/tables/books/booksBase.js');
const usersBase = require('../../testing_utils/tables/users/usersBase.js');
const creditCardsBase = require('../../testing_utils/tables/credit_cards/creditCardsBase.js');
const reviewsBase = require('../../testing_utils/tables/reviews/reviewsBase.js');
const wishlistsBase = require('../../testing_utils/tables/wishlists/wishlistsBase.js');
const booksWishlistsLTBase = require('../../testing_utils/linking_tables/books_wishlists_lt/booksWishlistsLTBase.js');
const shoppingCartsLTBase = require('../../testing_utils/linking_tables/shopping_carts_lt/shoppingCartsLTBase.js');

const { clientFactory } = require('../../database/setupFxns.js');
const { Models, ModelIterable } = require('../../testing_utils/tables/Models.js');
const TestingPayload = require('../TestingPayload.js');
const { LogicTestMap } = require('./Logic.js');
const { ErrorsTestMap } = require('./Errors.js');

const databaseInstantiationPayload = {
    identifiers: [
        "authors",
        "publishers",
        "genres",
        "books",
        "users",
        "credit_cards",
        "reviews",
        "wishlists",
        "books_wishlists_lt",
        "shopping_carts_lt",
    ],
    nonCascadeDeletions: [
        "authors",
        "publishers",
        "genres",
        "books",
        "users",
    ],
    dataPayloads: [
        authorsBase,
        publishersBase,
        genresBase,
        booksBase,
        usersBase,
        creditCardsBase,
        reviewsBase,
        wishlistsBase,
        booksWishlistsLTBase,
        shoppingCartsLTBase
    ],
};

const testSuiteOne = {
    describeStatement: "Expect InvalidPrimaryKeyError for all tables",
    testPayloadConstructor: (Model, client) => {
        return [
            new TestingPayload(
                `given that ${Model.idName} is queried by keyArrays [ [-1] ], an InvalidPrimaryKeyError should be thrown`,
                "validatePrimaryKey",
                [Model, [ [-1] ], client]
            ),
            new TestingPayload(
                `given that ${Model.idName} is queried by keyArrays [ [1000000] ], an InvalidPrimaryKeyError should be thrown`,
                "validatePrimaryKey",
                [Model, [ [1000000] ], client]
            )
        ];
    }
};

const testSuiteTwo = {
   describeStatement: "Expect InvalidForeignKeyError",
    testPayloadConstructor: (Model, client) => {
        return [
            new TestingPayload(
                `given that ${Model.modelName} is has been persisted an "author_id_fkey" of -1, a InvalidForeignKeyError should be thrown`,
                "validateForeignKeyExists",
                [() => Model.verifyForeignKeyString("author_id", "authors"), -1, client]
            ),
            new TestingPayload(
                `given that ${Model.modelName} is has been persisted an "publisher_id_fkey" of -1, a InvalidForeignKeyError should be thrown`,
                "validateForeignKeyExists",
                [() => Model.verifyForeignKeyString("publisher_id", "publishers"), -1, client]
            ),
            new TestingPayload(
                `given that ${Model.modelName} is has been persisted an "genre_id_fkey" of -1, a InvalidForeignKeyError should be thrown`,
                "validateForeignKeyExists",
                [() => Model.verifyForeignKeyString("genre_id", "genres"), -1, client]
            ),
            new TestingPayload(
                `given that ${Model.modelName} is has been persisted an "author_id_fkey" of -1000000, a InvalidForeignKeyError should be thrown`,
                "validateForeignKeyExists",
                [() => Model.verifyForeignKeyString("author_id", "authors"), -1000000, client]
            ),
            new TestingPayload(
                `given that ${Model.modelName} is has been persisted an "publisher_id_fkey" of -1000000, a InvalidForeignKeyError should be thrown`,
                "validateForeignKeyExists",
                [() => Model.verifyForeignKeyString("publisher_id", "publishers"), -1000000, client]
            ),
            new TestingPayload(
                `given that ${Model.modelName} is has been persisted an "genre_id_fkey" of -1000000, a InvalidForeignKeyError should be thrown`,
                "validateForeignKeyExists",
                [() => Model.verifyForeignKeyString("genre_id", "genres"), -1000000, client]
            )
        ];
    }
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
    for (let identifier of databaseInstantiationPayload.identifiers) {
        //console.log(identifier);
        //console.log(databaseControl.getKeyArraysFromMap(identifier));
    }
});

afterAll(async () => {
    await databaseControl.tearDownDatabase();
    for (let identifier of databaseInstantiationPayload.nonCascadeDeletions) {
        //console.log(identifier);
        //console.log(databaseControl.getDeletionResultsFromMap(identifier));
    }
});

test("Test InvalidPrimaryKeyError Standard on All Tables", async () => {
    const client = clientFactory();
    const { testPayloadConstructor: genPayload } = testSuiteOne;
    try {
        await client.connect();
        for (let Model of ModelIterable) {
            let payloadArray = genPayload(Model, client);
            for (let payload of payloadArray) {
                let externalError;
                try {
                    await payload.runAsyncTest(LogicTestMap);
                }
                catch (error) {
                    externalError = error
                }
                expect(externalError.name).toMatch("InvalidPrimaryKeyError");
            }
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await client.end(); 
    }
});

test("Test InvalidForeignKeyError Standard on All Tables", async () => {
    const client = clientFactory();
    const { testPayloadConstructor: genPayload } = testSuiteTwo;
    try {
        await client.connect();
        let payloadArray = genPayload(Models.BookModel, client);
        for (let payload of payloadArray) {
            let externalError;
            try {
                await payload.runAsyncTest(LogicTestMap);
            }
            catch (error) {
                externalError = error
            }
            expect(externalError.name).toMatch("InvalidForeignKeyError");
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await client.end(); 
    }
});