const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [tableNamesMap.authors, tableNamesMap.publishers, tableNamesMap.genres, tableNamesMap.books];

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

describe("GET top_sellers: Validate correct database instantiation and GET functionality", () => {
    test("GET request for top sellers", async () => {
        
        const res = await supertest(createServer())
            .get("/top_sellers")
            .expect(200);
        
        
        console.log(res.body);

        
    });
});
