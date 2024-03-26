const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const { clientFactory } = require('../../../database/setupFxns.js');
const createServer = require('../../../util/createServer.js');
const CreditCardModel = require('./CreditCardModel.js');


const databaseInstantiationPayload = {
    identifiers:  [ "credit_cards" ],
    nonCascadeDeletions: [ "credit_cards" ],
    dataPayloads: [
        {
            identifier: "credit_cards",
            data: 
            [
                {
                    "credit_card_number": "3555264663306000",
                    "expiration": "0000",
                    "ccv": "000",
                },
                {
                    "credit_card_number": "3555264663306001",
                    "expiration": "0001",
                    "ccv": "001", 
                },
                {
                    "credit_card_number": "3555264663306002",
                    "expiration": "0002",
                    "ccv": "002",
                },
                {
                    "credit_card_number": "3555264663306003",
                    "expiration": "0003",
                    "ccv": "003",
                },
                {
                    "credit_card_number": "3555264663306004",
                    "expiration": "0004",
                    "ccv": "003",
                },
                {
                    "credit_card_number": "3555264663306005",
                    "expiration": "0005",
                    "ccv": "005",
                }
            ]       
        }
    ]
};

function generateComparisonObject(dataObject) {
    const build = JSON.parse(JSON.stringify(dataObject));
    if (build.hasOwnProperty("card_id")) {
        delete build.card_id;
    }
    delete build.card_id;
    delete build.user_id_fkey;
    return build;
}

const DATA_REF = databaseInstantiationPayload.dataPayloads[0].data;
const DATA_LENGTH = databaseInstantiationPayload.dataPayloads[0].data.length;


let primaryKeys = [];

const databaseControl = new DatabaseControl(databaseInstantiationPayload);
beforeAll(async () => {
    await databaseControl.setupDatabase();
});

afterAll(async () => {
    await databaseControl.tearDownDatabase();
});

const data = [
    {
        credit_card_number: "0000000000000011",
        expiration: "0011",
        ccv: "011",

    },
    {
        credit_card_number: "0000000000000022",
        expiration: "0022",
        ccv: "022",
       
    },
    {
        credit_card_number: "0000000000000033",
        expiration: "0033",
        ccv: "033",
    },
    {
        credit_card_number: "0000000000000044",
        expiration: "0044",
        ccv: "044",
    }
];


describe("Validate correct database instantiation and GET functionality", () => {
    test("All credit cards are present from payload", async () => {
        const keyArrays = databaseControl.getKeyArraysFromMap("credit_cards");
        expect(keyArrays.length > 0).toBe(true);
        let res = await supertest(createServer())
            .get(`/credit_cards?id=[${keyArrays.map((array) => array[0]).join(",")}]`)
            .expect(200);
        let responseLen = res.body.response.length;
        expect(responseLen).toBe(DATA_LENGTH);
        for (let i = 0; i < responseLen; i++) {
            let dataObject = res.body.response[i];
            delete dataObject.card_id;
            expect(dataObject).toEqual(expect.objectContaining(DATA_REF[i]));
        }
    });
});

describe("Validate Single POST", () => {
    test("Single POST works on credit cards table/route", async () => {
        let dataPayload = [data[0]];
        let res = await supertest(createServer())
            .post("/credit_cards")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(Array.isArray(responseRef)).toBe(true); 
        expect(responseRef.length).toBe(dataPayload.length);
        let dataObjectRef = responseRef[0];
        primaryKeys.push(dataObjectRef.card_id);
        delete dataObjectRef.card_id;
        delete dataObjectRef.user_id_fkey;
        // console.log("dataPayload[0]:", JSON.stringify(dataPayload[0], null, 2));
        // console.log("dataObjectRef:", JSON.stringify(dataObjectRef, null, 2));
        let dataPayloadString = JSON.stringify(dataPayload[0]);
        let dataObjectRefString = JSON.stringify(dataObjectRef);
        expect(dataPayloadString).toBe(dataObjectRefString);
    });
});

describe("Validate Multiple POST", () => {
    test("\n\tMultiple POST works on credit cards table/route", async () => {
        let dataPayload = data.slice(1, data.length);
        let res = await supertest(createServer())
            .post("/credit_cards")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            primaryKeys.push(dataObjectRef.card_id);
            delete dataObjectRef.card_id;
            delete dataObjectRef.user_id_fkey;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});

describe("Validate Single UPDATE", () => {
    test("Single UPDATE works on credit cards table/route", async () => {
        let dataPayload = [{
            credit_card_number: data[0].credit_card_number + "0000000000001234",
            expiration: "1234",
            ccv: "234"
        }];
        let res = await supertest(createServer())
            .put(`/credit_cards?id=[${primaryKeys[0]}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(Array.isArray(responseRef)).toBe(true);
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.card_id;
        delete dataObjectRef.user_id_fkey;
        let updatedDataPayload = {
            credit_card_number: dataPayload[0].credit_card_number,
            expiration: dataPayload[0].expiration,
            ccv: dataPayload[0].ccv
        };
        let updatedDataPayloadString = JSON.stringify(updatedDataPayload);
        let dataObjectRefString = JSON.stringify(dataObjectRef);
        expect(updatedDataPayloadString).toBe(dataObjectRefString);
    });
});

describe("Validate Multiple UPDATE", () => {
    test("Multiple UPDATE works on credit cards table/route", async () => {
        let dataPayload = data.slice(1, data.length).map((dataObject) => ({
            credit_card_number: dataObject.credit_card_number + "updated",
            expiration: dataObject.expiration + "updated",
            ccv: dataObject.ccv + "updated"
        }));
        let res = await supertest(createServer())
            .put(`/credit_cards?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            delete dataObjectRef.card_id;
            delete dataObjectRef.user_id_fkey;
            // console.log("Expected:", JSON.stringify(dataPayload[i]));
            // console.log("Received:", JSON.stringify(dataObjectRef));
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    });
});



describe("Validate Single DELETE", () => {
    test("Single DELETE works on credit cards table/route", async () => {
        let res = await supertest(createServer())
            .delete(`/credit_cards?id=[${primaryKeys[1]}]`)
            .expect(200);

        let responseRef = res.body.response;
        expect(responseRef.length === 1).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.card_id;
        delete dataObjectRef.user_id_fkey;
        // console.log("Expected:", JSON.stringify({ 
        //     credit_card_number: data[1].credit_card_number + "updated",
        //     expiration: data[1].expiration + "updated",
        //     ccv: data[1].ccv + "updated"
        // }));
        // console.log("Received:", JSON.stringify(dataObjectRef));
        expect(JSON.stringify({ 
            credit_card_number: data[1].credit_card_number + "updated",
            expiration: data[1].expiration + "updated",
            ccv: data[1].ccv + "updated"
        })).toEqual(JSON.stringify(dataObjectRef));
    });
});



