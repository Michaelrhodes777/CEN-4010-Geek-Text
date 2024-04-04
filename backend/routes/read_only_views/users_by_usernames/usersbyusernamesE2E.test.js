const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [tableNamesMap.users]; 

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

describe("GET users by usernames: Validate correct database instantiation and GET functionality", () => {
    test("GET request with multiple usernames", async () => {
        
        const usernames = ["user1", "user2"];
        
        const usernamesQueryParam = encodeURIComponent(`[${usernames.join(",")}]`);
        
        const res = await supertest(createServer())
            .get(`/users_by_usernames?usernames=${usernamesQueryParam}`) 
            .expect(200);

        console.log(res.body);

        
        expect(res.body).toHaveProperty('response');
        expect(Array.isArray(res.body.response)).toBe(true);
        expect(res.body.response.length).toBe(usernames.length);
        
    });
});
