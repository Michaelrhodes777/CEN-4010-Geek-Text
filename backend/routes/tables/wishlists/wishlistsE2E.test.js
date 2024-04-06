const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [ tableNamesMap.users, tableNamesMap.wishlists ];

const databaseInstantiationPayload = {
    identifiers,
    nonCascadeDeletions: [ tableNamesMap.users ],
    dataPayloads: identifiers.map((identifier) => (tablesE2EBaseMap[identifier]))
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});
afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

function generateComparisonObject(dataObject) {
    const build = JSON.parse(JSON.stringify(dataObject));
    delete build.wishlist_id;
    delete build.user_id_fkey;
    return build;
}

describe("GET E2E wishlists: Validate correct database instantiation and GET functionality", () => {
    test(`\n\tValidate wishlists has been seeded`, async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("wishlists").map((array) => (array[0]));
        const res = await supertest(createServer())
            .get(`/wishlists?id=[${arrayOfKeys.join(",")}]`)
            .expect(200);
        const { response } = res.body;
        const e2eBase = tablesE2EBaseMap.wishlists;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length == e2eBase.data.length).toBe(true);
        for (let i = 0; i < e2eBase.data.length; i++) {
            let dataObject = response[i];
            const { user_id_fkey } = dataObject;
            expect(user_id_fkey).toBeTruthy();
            const expected = generateComparisonObject(e2eBase.data[i]);
            const actual = generateComparisonObject(dataObject);
            for (let prop in expected) {
                expect(expected[prop] === actual[prop]).toBe(true);
            }
        }
    });
});

describe("POST E2E wishlists: Single id", () => {
    test("\n\tValidate single POST request", async () => {
        const userKey = databaseControl.getKeyArraysFromMap("users")[0];
        let data = [
            {
                "user_id_fkey": userKey[0],
                "wishlist_name": "created wishlist"
            }
        ];

        const res = await supertest(createServer())
            .post("/wishlists")
            .send(data)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === 1).toBe(true);

        expect(response[0].wishlist_id).toBeTruthy();
        let expected = generateComparisonObject(data[0]);
        let actual = generateComparisonObject(response[0]);
        for (let prop in expected) {
            expect(expected[prop] === actual[prop]).toBe(true);
        }

        const deletions = await supertest(createServer())
            .delete(`/wishlists?id=[${response[0].wishlist_id}]`)
            .expect(200);
        expect(Array.isArray(deletions.body.response)).toBe(true);
        expect(deletions.body.response.length === 1).toBe(true);
        expect(deletions.body.response[0]).toBeTruthy();
    });
});

describe("POST E2E wishlists: Multiple id", () => {
    test("\n\tValidate multiple POST request", async () => {
        const userKeyArray = databaseControl.getKeyArraysFromMap("users").slice(1, 3);
        let data = [
            {
                "user_id_fkey": userKeyArray[0][0],
                "wishlist_name": "created wishlist"
            },
            {
                "user_id_fkey": userKeyArray[1][0],
                "wishlist_name": "created wishlist"
            }
        ];
        
        const res = await supertest(createServer())
            .post(`/wishlists`)
            .send(data)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === data.length);
        for (let i = 0; i < data.length; i++) {
            expect(response[i]).toBeTruthy();
        }

        const deletions = await supertest(createServer())
            .delete(`/wishlists?id=[${response.map((dataObject) => (dataObject.wishlist_id)).join(",")}]`)
            .expect(200);
        expect(Array.isArray(deletions.body.response)).toBe(true);
        expect(deletions.body.response.length === data.length).toBe(true);
        for (let dataObject of deletions.body.response) {
            expect(dataObject).toBeTruthy();
        }
    });
});

describe("PUT E2E wishlists: Single id", () => {
    test("\n\tValidate single PUT request", async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("wishlists")[0];
        let res = await supertest(createServer())
            .put(`/wishlists?id=[${arrayOfKeys[0]}]`)
            .send([ { "wishlist_name": "updated" } ])
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === 1).toBe(true);
        expect(response[0].wishlist_name === "updated").toBe(true);
    });
});

describe("PUT E2E wishlists: Multiple id", () => {
    test("\n\tValidate multiple PUT request", async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("wishlists").slice(1);
        let res = await supertest(createServer())
            .put(`/wishlists?id=[${arrayOfKeys.join(",")}]`)
            .send(arrayOfKeys.map(() => ({ "wishlist_name": "updated" })))
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === arrayOfKeys.length).toBe(true);
        for (let i = 0; i < arrayOfKeys.length; i++) {
            expect(response[i]).toBeTruthy();
            expect(response[i].wishlist_name === "updated").toBe(true);
        }
    });
});

describe("DELETE E2E wishlists: Single id", () => {
    test("\n\tValidate single DELETE request", async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap(tableNamesMap.wishlists)[0];
        let res = await supertest(createServer())
            .delete(`/wishlists?id=[${arrayOfKeys[0]}]`)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length == 1).toBe(true);
        expect(response[0]).toBeTruthy();
    });
});

describe("DELETE E2E wishlists: Mulitple id", () => {
    test("\n\tValidate multiple DELETE request", async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap(tableNamesMap.wishlists);
        let res = await supertest(createServer())
            .delete(`/wishlists?id=[${arrayOfKeys.slice(1).join(",")}]`)
            .expect(200);
        const { response } = res.body;
        const e2eBase = tablesE2EBaseMap.wishlists;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length == e2eBase.data.length - 1).toBe(true);
        for (let i = 0; i < response.length; i++) {
            expect(response[i]).toBeTruthy();
        }
    }); 
});