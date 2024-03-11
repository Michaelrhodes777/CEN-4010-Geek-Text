const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const { clientFactory } = require('../../../database/setupFxns.js');
const createServer = require('../../../util/createServer.js');

const databaseInstantiationPayload = {
    identifiers:  [ "genres" ],
    nonCascadeDeletions: [ "genres" ],
    dataPayloads: [
        {
            identifier: "genres",
            data: [
                {
                    "genre_name": "documentaries genre"
                },
                {
                    "genre_name": "comedies genre"
                },
                {
                    "genre_name": "wars genre"
                },
                {
                    "genre_name": "animations genre"
                },
                {
                    "genre_name": "drama genre"
                }
            ]
        }
    ]
};

const DATA_REF = databaseInstantiationPayload.dataPayloads[0].data;
const DATA_LENGTH = databaseInstantiationPayload.dataPayloads[0].data.length;

const data = [
    {
        genre_name: "firstnewgenrename",
    },            
    {
        genre_name: "secondnewgenrename",
    },
    {
        genre_name: "thirdnewgenrename",
    },
    {
        genre_name: "fourthnewgenrename",
    },
    {
        genre_name: "fifthnewgenrename",
    }
];

let primaryKeys = [];

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});

afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

describe("Validate correct database instantiation and GET functionality", () => {
    test("\n\tAll genres are present from payload", async () => {
        let res = await supertest(createServer())
            .get(`/genres?id=[${databaseControl.getKeyArraysFromMap("genres").map((array) => (array[0])).join(",")}]`)
            .expect(200);
        let responseLen = res.body.response.length;
        expect(responseLen === DATA_LENGTH).toBe(true);
        for (let i = 0; i < responseLen; i++) {
            let dataObject = res.body.response[i];
            delete dataObject.genre_id;
            dataObject[i] = JSON.stringify(dataObject);
            expect(dataObject[i] === JSON.stringify(DATA_REF[i])).toBe(true);
        }   
    });
});

describe("Validate Single POST", () => {
    test("\n\tSingle POST works on genres table/route", async () => {
        let dataPayload = [ data[0] ];
        let res = await supertest(createServer())
            .post("/genres")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        primaryKeys.push(dataObjectRef.genre_id);
        delete dataObjectRef.genre_id;
        expect(JSON.stringify(dataPayload[0]) === JSON.stringify(dataObjectRef)).toBe(true);
    })
});

describe("Validate Multiple POST", () => {
    test("\n\tMultiple POST works on genres table/route", async () => {
        let dataPayload = data.slice(1, data.length);
        let res = await supertest(createServer())
            .post("/genres")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            primaryKeys.push(dataObjectRef.genre_id);
            delete dataObjectRef.genre_id;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});


describe("Validate Single UPDATE", () => {
    test("\n\tSingle UPDATE works on genres table/route", async () => {
        let dataPayload = [ { genre_name: data[0].genre_name + "updated" } ];
        let res = await supertest(createServer())
            .put(`/genres?id=[${primaryKeys[0]}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.genre_id;
        expect(JSON.stringify(dataPayload[0]) === JSON.stringify(dataObjectRef)).toBe(true);
    });
});

describe("Validate Multiple UPDATE", () => {
    test("\n\tMultiple UPDATE works on genres table/route", async () => {
        let dataPayload = data.slice(1, data.length).map((dataObject) => ({ genre_name: dataObject.genre_name + "updated" }));
        let res = await supertest(createServer())
            .put(`/genres?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            delete dataObjectRef.genre_id;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});

describe("Validate Single DELETE", () => {
    test("\n\tSingle DELETE works on genres table/route", async () => {
        let res = await supertest(createServer())
            .delete(`/genres?id=[${primaryKeys[0]}]`)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === 1).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.genre_id;
        expect(JSON.stringify({ genre_name: data[0].genre_name + "updated" }) === JSON.stringify(dataObjectRef)).toBe(true);
    });
});

describe("Validate Multiple DELETE", () => {
    test("\n\tMultiple DELETE works on genres table/route", async () => {
        let res = await supertest(createServer())
            .delete(`/genres?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === data.length - 1).toBe(true);
        for (let i = 0; i < data.length - 1; i++) {
            let dataObjectRef = responseRef[i];
            delete dataObjectRef.genre_id;
            expect(JSON.stringify({ genre_name: data[i + 1].genre_name + "updated" }) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});