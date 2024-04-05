const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [tableNamesMap.authors, tableNamesMap.publishers, tableNamesMap.genres, tableNamesMap.books, tableNamesMap.users, tableNamesMap.reviews];

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
    test(`\n\tGET request: by_book_id`, async () => {
        const { book_id } = databaseControl.dataPackages.books.rows[0];
        const res = await supertest(createServer())
            .get(`/average_book_ratings/by_book_id/${book_id}`)
            .expect(200);
    });

    test(`\n\tGET request: by_average_rating`, async () => {
        const average_rating = 4; 
        const res = await supertest(createServer())
            .get(`/average_book_ratings/by_average_rating/${average_rating}`)
            .expect(200);
        
        expect(Array.isArray(res.body.response)).toBe(true);
        if (res.body.response.length > 0) {
            expect(res.body.response[0]).toHaveProperty('average_rating');
            expect(Number(res.body.response[0].average_rating)).toBeGreaterThanOrEqual(average_rating);
        }
    });
});
