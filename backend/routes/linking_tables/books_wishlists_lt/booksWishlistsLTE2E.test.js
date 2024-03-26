const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, tablesE2EBaseMap } = TablesConsumables;
const LinkingTablesConsumables = require('../../../testing_utils/linking_tables/LinkingTablesConsumables.js');
const { linkingTablesNamesMap, linkingTablesE2EBaseMap } = LinkingTablesConsumables;

const identifiers = [
    tableNamesMap.users,
    tableNamesMap.authors,
    tableNamesMap.publishers,
    tableNamesMap.genres,
    tableNamesMap.books,
    tableNamesMap.wishlists,
    linkingTablesNamesMap.books_wishlists_lt
];

const databaseInstantiationPayload = {
    identifiers,
    nonCascadeDeletions: [ tableNamesMap.users, tableNamesMap.authors, tableNamesMap.publishers, tableNamesMap.genres, tableNamesMap.books, tableNamesMap.wishlists ],
    dataPayloads: [ tablesE2EBaseMap.users, tablesE2EBaseMap.authors, tablesE2EBaseMap.publishers, tablesE2EBaseMap.genres, tablesE2EBaseMap.books, tablesE2EBaseMap.wishlists, linkingTablesE2EBaseMap.books_wishlists_lt ]
};

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});
afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

describe("GET E2E books_wishlists_lt: Validate correct database instantiation and GET qid functionality", () => {
    test(`\n\tValidate books_wishlists_lt has been seeded`, async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("wishlists").map((array) => (array[0]));
        const res = await supertest(createServer())
            .get(`/books_wishlists_lt?qid=[${arrayOfKeys.join(",")}]`)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        let numBooks = 0;
        for (let i = 0; i < response.length; i++) {
            for (let dataObject of response[i]) {
                expect(dataObject.book_id_fkey).toBeTruthy();
                expect(dataObject.wishlist_id_fkey).toBeTruthy();
                numBooks++;
            }
        }
        expect(linkingTablesE2EBaseMap.books_wishlists_lt.data.length === numBooks).toBe(true);
    });
});

describe("GET E2E books_wishlists_lt: Validate correct database instantiation and GET cid functionality", () => {
    test(`\n\tValidate books_wishlists_lt has been seeded`, async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("books_wishlists_lt").map((array) => (array.join(",")));
        const res = await supertest(createServer())
            .get(`/books_wishlists_lt?cid=[${arrayOfKeys.join(",")}]`)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        const e2eBaseData = linkingTablesE2EBaseMap.books_wishlists_lt.data;
        expect(e2eBaseData.length === response.length).toBe(true);
        for (let i = 0; i < e2eBaseData.length; i++) {
            const dataObject = response[i][0];
            const { book_id_fkey, wishlist_id_fkey } = dataObject;
            expect(book_id_fkey).toBeTruthy();
            expect(wishlist_id_fkey).toBeTruthy();
        }
    });
});

describe("POST E2E books_wishlists_lt: Single POST request", () => {
    test(`\t\tValidate single POST request`, async () => {
        const bookKeys = databaseControl.getKeyArraysFromMap("books").map((array) => (array[0]));
        const wishlistKeys = databaseControl.getKeyArraysFromMap("wishlists").map((array) => (array[0]))
        const data = [
            {
                "book_id_fkey": bookKeys[5],
                "wishlist_id_fkey": wishlistKeys[5]
            }
        ];
        const res = await supertest(createServer())
            .post('/books_wishlists_lt')
            .send(data)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === data.length).toBe(true);
        for (let i = 0; i < data.length; i++) {
            const { book_id_fkey, wishlist_id_fkey } = response[i];
            expect(book_id_fkey).toBeTruthy();
            expect(wishlist_id_fkey).toBeTruthy();
        }
        const deletionRes = await supertest(createServer())
            .delete(`/books_wishlists_lt?cid=[${data.map((dataObject) => (`${dataObject.book_id_fkey},${dataObject.wishlist_id_fkey}`)).join(",")}]`)
            .expect(200);
        const { response: deletionResponse } = deletionRes.body;
        expect(Array.isArray(deletionResponse)).toBe(true);
        expect(data.length === deletionResponse.length).toBe(true);
        for (let i = 0; i < data.length; i++) {
            const { book_id_fkey, wishlist_id_fkey } = deletionResponse[i];
            expect(book_id_fkey).toBeTruthy();
            expect(wishlist_id_fkey).toBeTruthy();
        }
    });
});

describe("POST E2E books_wishlists_lt: Multiple POST request", () => {
    test(`\t\tValidate multiple POST request`, async () => {
        const bookKeys = databaseControl.getKeyArraysFromMap("books").map((array) => (array[0]));
        const wishlistKeys = databaseControl.getKeyArraysFromMap("wishlists").map((array) => (array[0]));
        const data = [
            {
                "book_id_fkey": bookKeys[5],
                "wishlist_id_fkey": wishlistKeys[5]
            },
            {
                "book_id_fkey": bookKeys[4],
                "wishlist_id_fkey": wishlistKeys[5]
            }
        ];
        const res = await supertest(createServer())
            .post('/books_wishlists_lt')
            .send(data)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === data.length).toBe(true);
        for (let i = 0; i < data.length; i++) {
            const { book_id_fkey, wishlist_id_fkey } = response[i];
            expect(book_id_fkey).toBeTruthy();
            expect(wishlist_id_fkey).toBeTruthy();
        }
        const deletionRes = await supertest(createServer())
            .delete(`/books_wishlists_lt?cid=[${data.map((dataObject) => (`${dataObject.book_id_fkey},${dataObject.wishlist_id_fkey}`)).join(",")}]`)
            .expect(200);
        const { response: deletionResponse } = deletionRes.body;
        expect(Array.isArray(deletionResponse)).toBe(true);
        expect(data.length === deletionResponse.length).toBe(true);
        for (let i = 0; i < data.length; i++) {
            const { book_id_fkey, wishlist_id_fkey } = deletionResponse[i];
            expect(book_id_fkey).toBeTruthy();
            expect(wishlist_id_fkey).toBeTruthy();
        }
    });
});

describe("DELETE E2E books_wishlists_lt: Single id", () => {
    test("Validate single DELETE cid request", async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("books_wishlists_lt")[0];
        const res = await supertest(createServer())
            .delete(`/books_wishlists_lt?cid=[${arrayOfKeys.join(",")}]`)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === 1);
        expect(response[0].book_id_fkey).toBeTruthy();
        expect(response[0].wishlist_id_fkey).toBeTruthy();
    });
});

describe("DELETE E2E books_wishlists_lt: Multiple id", () => {
    test("Validate multiple DELETE qid request", async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("books_wishlists_lt").slice(1).map((array) => (array.join(",")));
        const res = await supertest(createServer())
            .delete(`/books_wishlists_lt?cid=[${arrayOfKeys.join(",")}]`)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === arrayOfKeys.length).toBe(true);
        for (let i = 0; i < response.length; i++) {
            const dataObject = response[i];
            const { book_id_fkey, wishlist_id_fkey } = dataObject;
            expect(book_id_fkey).toBeTruthy();
            expect(wishlist_id_fkey).toBeTruthy();
        }
    });
});