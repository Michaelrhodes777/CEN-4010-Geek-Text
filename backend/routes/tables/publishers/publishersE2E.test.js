const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const createServer = require('../../../util/createServer.js');

const databaseInstantiationPayload = {
    identifiers:  [ "publishers" ],
    nonCascadeDeletions: [ "publishers" ],
    dataPayloads: [
        {
            identifier: "publishers",
            data: [
                {
                    "publisher_name": "Buffalo : J.B. Lippincott",
                    "discount_percent": 3
                },
                {
                    "publisher_name": "Tour de France : A. Mame",
                    "discount_percent": 6
                },
                {
                    "publisher_name": "Eastside, City art printing company",
                    "discount_percent": 9
                }
            ]
        }
    ]
};

const DATA_REF = databaseInstantiationPayload.dataPayloads[0].data;
const DATA_LENGTH = databaseInstantiationPayload.dataPayloads[0].data.length;

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});

afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

describe("Validate correct database instantiation and GET functionality", () => {
    test("\n\tAll publishers are present from payload", async () => {
        let res = await supertest(createServer())
            .get(`/publishers?id=[${databaseControl.getKeyArraysFromMap("publishers").map((array) => (array[0])).join(",")}]`)
            .expect(200);
        let responseLen = res.body.response.length;
        expect(responseLen === DATA_LENGTH).toBe(true);
        for (let i = 0; i < responseLen; i++) {
            let dataObject = res.body.response[i];
            delete dataObject.publisher_id;
            dataObject[i] = JSON.stringify(dataObject);
            expect(dataObject[i] === JSON.stringify(DATA_REF[i])).toBe(true);
        }   
    });
});

const data = [
    {
        publisher_name: "firstnewpublishername",
        discount_percent: 5
    },            
    {
        publisher_name: "secondnewpublishername",
        discount_percent: 5
    },
    {
        publisher_name: "thirdnewpublishername",
        discount_percent: 5
    },
    {
        publisher_name: "fourthnewpublishername",
        discount_percent: 5
    },
    {
        publisher_name: "fifthnewpublishername",
        discount_percent: 5
    }
];

let primaryKeys = [];

describe("Validate Single POST", () => {
    test("\n\tSingle POST works on publishers table/route", async () => {
        let dataPayload = [ data[0] ];
        let res = await supertest(createServer())
            .post("/publishers")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        primaryKeys.push(dataObjectRef.publisher_id);
        delete dataObjectRef.publisher_id;
        expect(JSON.stringify(dataPayload[0]) === JSON.stringify(dataObjectRef)).toBe(true);
    })
});

describe("Validate Multiple POST", () => {
    test("\n\tMultiple POST works on publishers table/route", async () => {
        let dataPayload = data.slice(1, data.length);
        let res = await supertest(createServer())
            .post("/publishers")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            primaryKeys.push(dataObjectRef.publisher_id);
            delete dataObjectRef.publisher_id;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});

describe("Validate Single UPDATE", () => {
    test("\n\tSingle UPDATE works on publishers table/route", async () => {
        let dataPayload = [ { ...data[0], publisher_name: data[0].publisher_name + "updated" } ];
        let res = await supertest(createServer())
            .put(`/publishers?id=[${primaryKeys[0]}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.publisher_id;
        expect(JSON.stringify(dataPayload[0]) === JSON.stringify(dataObjectRef)).toBe(true);
    });
});

describe("Validate Multiple UPDATE", () => {
    test("\n\tMultiple UPDATE works on publishers table/route", async () => {
        let dataPayload = data.slice(1, data.length).map((dataObject) => ({ ...dataObject, publisher_name: dataObject.publisher_name + "updated" }));
        let res = await supertest(createServer())
            .put(`/publishers?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            delete dataObjectRef.publisher_id;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});

describe("Validate Single DELETE", () => {
    test("\n\tSingle DELETE works on publishers table/route", async () => {
        let res = await supertest(createServer())
            .delete(`/publishers?id=[${primaryKeys[0]}]`)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === 1).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.publisher_id;
        expect(JSON.stringify({ ...data[0], publisher_name: data[0].publisher_name + "updated" }) === JSON.stringify(dataObjectRef)).toBe(true);
    });
});

describe("Validate Multiple DELETE", () => {
    test("\n\tMultiple DELETE works on publishers table/route", async () => {
        let res = await supertest(createServer())
            .delete(`/publishers?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === data.length - 1).toBe(true);
        for (let i = 0; i < data.length - 1; i++) {
            let dataObjectRef = responseRef[i];
            delete dataObjectRef.publisher_id;
            expect(JSON.stringify({ ...data[i + 1], publisher_name: data[i + 1].publisher_name + "updated" }) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});