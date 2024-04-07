const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;
const LinkingTablesConsumables = require('../../../testing_utils/linking_tables/LinkingTablesConsumables.js');
const { linkingTablesNamesMap, linkingTablesE2EBaseMap } = LinkingTablesConsumables;

const identifiers = [
    tableNamesMap.users,
    tableNamesMap.authors,
    tableNamesMap.publishers,
    tableNamesMap.genres,
    tableNamesMap.books,
    tableNamesMap.wishlists,
    linkingTablesNamesMap.books_wishlists_lt,
    linkingTablesNamesMap.shopping_carts_lt
];

const databaseInstantiationPayload = {
    identifiers,
    nonCascadeDeletions: [ 
        tableNamesMap.users, 
        tableNamesMap.authors, 
        tableNamesMap.publishers, 
        tableNamesMap.genres, 
        tableNamesMap.books
    ],
    dataPayloads: [ 
        tablesE2EBaseMap.users, 
        tablesE2EBaseMap.authors, 
        tablesE2EBaseMap.publishers,
        tablesE2EBaseMap.genres,
        tablesE2EBaseMap.books,
        tablesE2EBaseMap.wishlists,
        linkingTablesE2EBaseMap.books_wishlists_lt,
        linkingTablesE2EBaseMap.shopping_carts_lt
    ]
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});
afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

describe("PUT E2E wishlistToCart: Validate correct database instantiation and PUT functionality", () => {
    test(`\n\tDELETE composite key from shopping cart`, async () => {
        const slt = databaseControl.dataPackages.shopping_carts_lt;
        const { user_id_fkey, book_id_fkey } = slt.rows[0];
        const resGet = await supertest(createServer())
            .get(`/shopping_carts_lt?cid=[${user_id_fkey},${book_id_fkey}]`)
            .expect(200);
        const resDelete = await supertest(createServer())
            .delete(`/shopping_carts_lt?cid=[${user_id_fkey},${book_id_fkey}]`)
            .expect(200);
    });
    test(`\n\tValidate PUT Request`, async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("books_wishlists_lt");
        const dataObject = {
            book_id: arrayOfKeys[0][0],
            wishlist_id: arrayOfKeys[0][1]
        };
        const res = await supertest(createServer())
            .put(`/wishlist_to_cart`)
            .send(dataObject)
            .expect(200);
    });
});