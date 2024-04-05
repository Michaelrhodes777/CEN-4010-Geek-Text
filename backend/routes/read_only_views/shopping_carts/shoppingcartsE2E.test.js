const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [
    tableNamesMap.users, 
    tableNamesMap.books,
    tableNamesMap.shopping_carts_lt
];

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

describe("GET shopping_carts: Validate correct database instantiation and GET functionality", () => {
    test(`GET request: user_id`, async () => {
        const { user_id } = databaseControl.dataPackages.users.rows[0]; 
        const res = await supertest(createServer())
            .get(`/shopping_carts/${user_id}`)
            .expect(200);
    });
});
