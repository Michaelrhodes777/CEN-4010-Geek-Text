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

describe("GET books_by_genres: Validate correct database instantiation and GET functionality", () => {
    test(`\n\tGET request: genre_name`, async () => {
        const { genre_name } = databaseControl.dataPackages.genres.rows[0];
        console.log(genre_name);
        const res = await supertest(createServer())
            .get(`/books_by_genres/by_genre_name/${genre_name}`)
            .expect(200);
    });

    test(`\n\tGET request: genre_name`, async () => {
        const { genre_id } = databaseControl.dataPackages.genres.rows[0];
        console.log(genre_id);
        const res = await supertest(createServer())
            .get(`/books_by_genres/by_genre_id/${genre_id}`)
            .expect(200);
    });
});