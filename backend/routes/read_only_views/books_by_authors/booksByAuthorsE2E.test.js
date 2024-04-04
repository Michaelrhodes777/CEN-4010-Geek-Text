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

describe("GET books_by_authors: Validate correct database instantiation and GET functionality", () => {
     test(`\n\tGET request: author_id`, async () => {
        const { author_id } = databaseControl.dataPackages.authors.rows[0];
        console.log(author_id);
        const res = await supertest(createServer())
            .get(`/books_by_authors/by_author_id/${author_id}`)
            .expect(200);
    });
});