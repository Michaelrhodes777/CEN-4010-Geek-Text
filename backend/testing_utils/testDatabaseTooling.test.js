const { clientFactory } = require('../database/setupFxns.js');

const DatabaseControl = require('./DatabaseControl.js');
const authorsBase = require('./tables/authors/authorsBase.js');
const publishersBase = require('./tables/publishers/publishersBase.js');
const genresBase = require('./tables/genres/genresBase.js');
const booksBase = require('./tables/books/booksBase.js');
const usersBase = require('./tables/users/usersBase.js');
const creditCardsBase = require('./tables/credit_cards/creditCardsBase.js');
const reviewsBase = require('./tables/reviews/reviewsBase.js');
const wishlistsBase = require('./tables/wishlists/wishlistsBase.js');

const booksWishlistsLTBase = require('./linking_tables/books_wishlists_lt/booksWishlistsLTBase.js');
const shoppingCartsLTBase = require('./linking_tables/shopping_carts_lt/shoppingCartsLTBase.js');

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

const databaseControl = new DatabaseControl(databaseInstantiationPayload);

beforeAll(async () => {
    await databaseControl.setupDatabase();
});

test("Validate database was seeded", async () => {
    const client = clientFactory();
    try {
        await client.connect();
        let { identifiers } = databaseInstantiationPayload;
        for (let i = 0; i < identifiers.length; i++) {
            let identifier = identifiers[i];
            let currentLength = databaseInstantiationPayload.dataPayloads[i].data.length;
            const response = await client.query({ text: `SELECT * FROM ${identifier}`});
            expect(response.rows.length === currentLength).toBe(true);
            //console.log(`expectation: ${identifier} ${response.rows.length} ${currentLength}`);
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await client.end(); 
    }
});

test("Proper Database setup/teardown. Database's tables should all be empty", async () => {
    try {
        await databaseControl.tearDownDatabase();
    }
    catch (error) {
        console.log(error);
    }

    const client = clientFactory();
    try {
        await client.connect();
        for (let identifier of databaseInstantiationPayload.identifiers) {
            let response = await client.query({ text: `SELECT * FROM ${identifier}` });
            //console.log(response.rows);
            //console.log(response.rows.length);
            let numRows = response.rows.length;
            expect(numRows === 0).toBe(true);
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await client.end(); 
    }
});