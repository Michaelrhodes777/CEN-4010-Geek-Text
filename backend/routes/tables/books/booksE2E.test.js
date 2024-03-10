const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const { clientFactory } = require('../../../database/setupFxns.js');
const createServer = require('../../../util/createServer.js');
const TablesConsumables = require('../../../testing_utils/tables/TablesConsumables.js');
const { tableNamesMap, idMap, tablesE2EBaseMap } = TablesConsumables;

const identifiers = [ tableNamesMap.authors, tableNamesMap.publishers, tableNamesMap.genres, tableNamesMap.books ];

const databaseInstantiationPayload = {
    identifiers,
    nonCascadeDeletions: identifiers,
    dataPayloads: identifiers.map((identifier) => tablesE2EBaseMap[identifier])
};

const DEL_REF = databaseInstantiationPayload.nonCascadeDeletions;
const PAYLOADS_REF = databaseInstantiationPayload.dataPayloads;

function generateComparisonObject(dataObject) {
    const build = JSON.parse(JSON.stringify(dataObject));
    if (build.hasOwnProperty("book_id")) {
        delete build.book_id;
    }
    delete build.author_id_fkey;
    delete build.genre_id_fkey;
    delete build.publisher_id_fkey;
    return build;
}

let primaryKeys = [];

const data = [
    {
        "book_name": "firstnewbook",   
        "isbn": "12345678901",
        "book_description": "firstnewdescription",
        "book_price": 777,
        "year_published": 2000,
        "copies_sold": 777
    },
    {
        "book_name": "secondnewbook",   
        "isbn": "12345678902",
        "book_description": "secondnewdescription",
        "book_price": 777,
        "year_published": 2000,
        "copies_sold": 777
    },
    {
        "book_name": "thirdnewbook",   
        "isbn": "12345678903",
        "book_description": "thirdnewdescription",
        "book_price": 777,
        "year_published": 2000,
        "copies_sold": 777
    },
    {
        "book_name": "fourthnewbook",   
        "isbn": "12345678904",
        "book_description": "fourthnewdescription",
        "book_price": 777,
        "year_published": 2000,
        "copies_sold": 777
    },
    {
        "book_name": "fifthnewbook",   
        "isbn": "12345678905",
        "book_description": "fifthnewdescription",
        "book_price": 777,
        "year_published": 2000,
        "copies_sold": 777
    }
];

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});
afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

describe("GET books: Validate correct database instantiation and GET functionality", () => {
    test(`\n\tValidate books has been seeded`, async () => {
        const arrayOfKeys = databaseControl.getKeyArraysFromMap("books").map((array) => (array[0]));
        const res = await supertest(createServer())
            .get(`/books?id=[${arrayOfKeys.join(",")}]`)
            .expect(200);
        const { response } = res.body;
        const e2eBase = tablesE2EBaseMap.books;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === e2eBase.data.length).toBe(true);
        for (let i = 0; i < e2eBase.data.length; i++) {
            let dataObject = response[i];
            const { author_id_fkey, genre_id_fkey, publisher_id_fkey } = dataObject;
            expect(author_id_fkey).toBeTruthy();
            expect(genre_id_fkey).toBeTruthy();
            expect(publisher_id_fkey).toBeTruthy();
            const actual = generateComparisonObject(dataObject);
            const expected = generateComparisonObject(e2eBase.data[i]);
            for (let prop in expected) {
                expect(expected[prop] === actual[prop]).toBe(true);
            }
        }
    });
});

describe("POST E2E books: single", () => {
    test("\n\tValidate single POST request", async () => {
        let res = await supertest(createServer())
            .post("/books")
            .send([ data[0] ])
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === 1).toBe(true);
        primaryKeys.push(response[0].book_id);
        const actual = generateComparisonObject(response[0]);
        const expected = generateComparisonObject(data[0]);
        for (let prop in expected) {
            expect(expected[prop] === actual[prop]).toBe(true);
        }
    });
});

describe("POST E2E books: multiple", () => {
    test("\n\tValidate single POST request", async () => {
        let slice = data.slice(1, data.length - 1);
        console.log(slice);
        let res = await supertest(createServer())
            .post("/books")
            .send(slice)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === slice.length).toBe(true);
        for (let i = 0; i < slice.length; i++) {
            primaryKeys.push(response[i].book_id);
            const actual = generateComparisonObject(response[i]);
            const expected = generateComparisonObject(slice[i]);
            for (let prop in expected) {
                expect(expected[prop] === actual[prop]).toBe(true);
            }
        }
    });
});

function updateFields(dataObject) {
    for (let prop in dataObject) {
        if (typeof dataObject[prop] === "number") {
            dataObject[prop] = dataObject[prop] + 1;
        }
        if (typeof dataObject[prop] === "string" && prop !== "isbn") {
            dataObject[prop] = dataObject[prop] + "updated";
        }
        if (prop === "isbn") {
            dataObject[prop] = dataObject[prop] + "0";           
        }
    }
}

describe("UPDATE E2E books: Single id", () => {
    test("\n\tValidate single UPDATE request", async () => {
        updateFields(data[0]);
        const res = await supertest(createServer())
            .put(`/books?id=[${primaryKeys[0]}]`)
            .send([ data[0] ])
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === 1).toBe(true);
        const expected = generateComparisonObject(response[0]);
        const actual = generateComparisonObject(data[0]);
        for (let prop in expected) {
            expect(expected[prop] === actual[prop]).toBe(true);
        }
    });
});

describe("UPDATE E2E books: Multiple id", () => {
    test("\n\tValidate multiple UPDATE request", async () => {
        for (let i = 1; i < data.length; i++) {
            updateFields(data[i]);
        }
        let slice = data.slice(1, data.length - 1);
        const res = await supertest(createServer())
            .put(`/books?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .send(slice)
            .expect(200);
        const { response } = res.body;
        expect(Array.isArray(response)).toBe(true);
        expect(response.length === slice.length).toBe(true);
        for (let i = 0; i < slice.length; i++) {
            const expected = generateComparisonObject(response[i]);
            const actual = generateComparisonObject(data[i + 1]);
            for (let prop in expected) {
                expect(expected[prop] === actual[prop]).toBe(true);
            }
        }
    });
});

describe("DELETE E2E books: Single id",() => {
    test("\n\tValidate single DELETE request", async () => {
        let res = await supertest(createServer())
            .delete(`/books?id=[${primaryKeys[0]}]`)
            .expect(200);
        const { response } = res.body;
        expect(response.length === 1).toBe(true);
        const actual = generateComparisonObject(response[0]);
        const expected = generateComparisonObject(data[0]);
        for (let prop in expected) {
            expect(expected[prop] === actual[prop]).toBe(true);
        }
    });
});

describe("DELETE E2E books: Multiple id",() => {
    test("\n\tValidate single DELETE request", async () => {
        let slice = primaryKeys.slice(1, primaryKeys.length)
        let res = await supertest(createServer())
            .delete(`/books?id=[${slice.join(",")}]`)
            .expect(200);
        const { response } = res.body;
        expect(response.length === slice.length).toBe(true);
        for (let i = 0; i < slice.length; i++) {
            const actual = generateComparisonObject(response[i]);
            const expected = generateComparisonObject(data[i + 1]);
            console.log(expected);
            console.log(actual);
            for (let prop in expected) {
                expect(expected[prop] === actual[prop]).toBe(true);
            }
        }
    });
});