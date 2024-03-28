const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

// Identifiers for tables involved in average book ratings view
const identifiers = [
    tableNamesMap.books,
    tableNamesMap.reviews
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

describe("GET average_book_ratings: Validate correct database instantiation and GET functionality", () => {
    test(`Validate average ratings calculation`, async () => {
        const res = await supertest(createServer())
            .get(`/average_book_ratings`)
            .expect(200);
        
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        
        // Assuming response is an array of objects with book_id and average_rating
        response.forEach(rating => {
            expect(rating).toHaveProperty('book_id');
            expect(rating).toHaveProperty('average_rating');
            expect(typeof rating.average_rating).toBe('number');

            // Further checks can be performed here to compare against expected values
            // This might include checks for specific books if your test database is seeded with known values
            // For example: expect(rating.average_rating).toBeCloseTo(expectedValue);
        });
    });
});
