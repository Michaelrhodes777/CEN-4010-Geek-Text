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

describe("GET shopping_carts: Validate correct database instantiation and GET functionality", () => {
    test(`GET request: user_id`, async () => {
        const { user_id } = databaseControl.dataPackages.users.rows[0];
        const res = await supertest(createServer())
            .get(`/shopping_carts/${user_id}`)
            .expect(200);
    });
});
