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
    linkingTablesNamesMap.books_wishlists_lt
];

const databaseInstantiationPayload = {
    identifiers,
    nonCascadeDeletions: [ tableNamesMap.users, tableNamesMap.authors, tableNamesMap.publishers, tableNamesMap.genres, tableNamesMap.books, tableNamesMap.wishlists ],
    dataPayloads: [ tablesE2EBaseMap.users, tablesE2EBaseMap.authors, tablesE2EBaseMap.publishers, tablesE2EBaseMap.genres, tablesE2EBaseMap.books, tablesE2EBaseMap.wishlists, linkingTablesE2EBaseMap.books_wishlists_lt ]
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});
afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

describe("GET books_by_wishlists: Validate correct database instantiation and GET functionality", () => {
    test(`\n\tGET request`, async () => {
        const { wishlist_id } = databaseControl.dataPackages.wishlists.rows[0];
        const res = await supertest(createServer())
            .get(`/books_by_wishlists/${wishlist_id}`)
            .expect(200);
    });
});