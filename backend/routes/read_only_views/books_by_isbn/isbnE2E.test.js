const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [ tableNamesMap.authors, tableNamesMap.publishers, tableNamesMap.genres, tableNamesMap.books ];

const databaseInstantiationPayload = {
    identifiers,
    nonCascadeDeletions: identifiers,
    dataPayloads: identifiers.map((identifier) => tablesE2EBaseMap[identifier])
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});
afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

describe("GET books_by_isn: Validate correct database instantiation and GET functionality", () => {
    test(`\n\tGET request`, async () => {
        const { isbn } = databaseControl.dataPackages.books.rows[0];
        const res = await supertest(createServer())
            .get(`/books_by_isbn/${isbn}`)
            .expect(200);
    });
});