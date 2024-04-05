const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, idMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [ tableNamesMap.users ];

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

describe("GET users: Validate correct database instantiation and GET functionality", () => {
    test(`\n\tValidate users has been seeded`, async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("users").map((array) => (array[0]));
        const res = await supertest(createServer())
            .get(`/users?id=[${arrayOfKeys.join(",")}]`) // [ 1, 2, 3, 45, 5 ] => "[1,2,3,45,5]" => "/users?id[1,2,3,45,5]"
            .expect(200);
        const { response } = res.body;
        const e2eBase = tablesE2EBaseMap.users;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === e2eBase.data.length).toBe(true);
        for (let i = 0; i < e2eBase.data.length; i++) {
            let dataObject = response[i];
            for (let prop in e2eBase.data[i]) {
                expect(dataObject[prop] === e2eBase.data[i][prop]).toBe(true);
            }
        }
    });
});

const data = [
    {
        "username": "demouserone",
        "password": "quamquamquam1A*",
        "first_name": "john",
        "last_name": "smith" 
    },
    {
        "username": "demousertwo",
        "password": "quamquamquam1A*",
        "first_name": "john",
        "last_name": "smith" 
    },
    {
        "username": "demouserthree",
        "password": "quamquamquam1A*",
        "first_name": "john",
        "last_name": "smith" 
    }
];

const ids = [];

describe("POST E2E users: single", () => {
    test("\n\tValidate single POST request", async () => {
        const res = await supertest(createServer())
            .post("/users")
            .send([ data[0] ])
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === 1).toBe(true);
        ids.push(response[0][idMap.users]);
        for (let prop in data[0]) {
            expect(response[0][prop] == data[0][prop]).toBe(true);
        }
    });
});

describe("POST E2E users: multiple", () => {
    test("\n\tValidate multiple POST request", async () => {
        const slice = data.slice(1);
        const res = await supertest(createServer())
            .post("/users")
            .send(slice)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === slice.length).toBe(true);
        for (let i = 0; i < slice.length; i++) {
            let dataObject = response[i];
            ids.push(dataObject.user_id);
            for (let prop in data[i + 1]) {
                expect(dataObject[prop] == data[i + 1][prop]).toBe(true);               
            }
        }
    });
});

let updateData = [
    {
        "last_name": "adams",
    },
    {
        "last_name": "adams",
    },
    {
        "last_name": "adams",
    },
];

describe("PUT E2E users: Multiple id", () => {
    test("\n\tValidate multiple PUT request", async () => {
        const slice = updateData.slice(1);
        const res = await supertest(createServer())
            .put(`/users?id=[${ids.slice(1).join(",")}]`)
            .send(slice)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === slice.length).toBe(true);
        for (let i = 0; i < slice.length; i++) {
            let dataObject = response[i];
            for (let prop in updateData[i + 1]) {
                expect(dataObject[prop] == updateData[i + 1][prop]).toBe(true);      
            }
        }        
    });
});

describe("DELETE E2E users: single", () => {
    test("\n\tValidate single DELETE request", async () => {
        const res = await supertest(createServer())
            .delete(`/users?id=[${ids[0]}]`)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === 1).toBe(true);
    });
});

describe("DELETE E2E users: multiple", () => {
    test("\n\tValidate multiple DELETE request", async () => {
        const slice = ids.slice(1);
        const res = await supertest(createServer())
            .delete(`/users?id=[${slice.join(",")}]`)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === slice.length).toBe(true);
    });
});