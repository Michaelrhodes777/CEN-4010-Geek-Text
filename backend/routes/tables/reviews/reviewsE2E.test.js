const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const { clientFactory } = require('../../../database/setupFxns.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, idMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [
    tableNamesMap.authors,
    tableNamesMap.publishers,
    tableNamesMap.genres,
    tableNamesMap.books,
    tableNamesMap.users,
    tableNamesMap.reviews
];

const databaseInstantiationPayload = {
    identifiers,
    nonCascadeDeletions: identifiers.slice(0, identifiers.length - 1),
    dataPayloads: identifiers.map((identifier) => tablesE2EBaseMap[identifier])
};

console.log(databaseInstantiationPayload);
console.log(databaseInstantiationPayload.dataPayloads);

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});
afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

function generateComparisonObject(dataObject) {
    const build = JSON.parse(JSON.stringify(dataObject));
    delete build.book_id_fkey;
    delete build.user_id_fkey;
    return build;
}

describe("GET reviews: Validate correct database instantiation and GET functionality", () => {
    test(`\n\tValidate reviews has been seeded`, async () => {
        console.log(databaseControl.dataPackages.reviews.rows);
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("reviews").map((array) => (array[0]));
        const res = await supertest(createServer())
            .get(`/reviews?id=[${arrayOfKeys.join(",")}]`)
            .expect(200);
            const { response } = res.body;
            const e2eBase = tablesE2EBaseMap.reviews;
            expect(Array.isArray(response)).toBe(true);
            expect(response.length === e2eBase.data.length).toBe(true);
            for (let i = 0; i < e2eBase.data.length; i++) {
                let dataObject = generateComparisonObject(response[i]);
                let origObject = generateComparisonObject(e2eBase.data[i]);
                for (let prop in e2eBase.data[i]) {
                    expect(dataObject[prop] === origObject[prop]).toBe(true);
                }
            }
    });
});