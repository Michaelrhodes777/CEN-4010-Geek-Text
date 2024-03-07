const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const { clientFactory } = require('../../../database/setupFxns.js');
const createServer = require('../../../util/createServer.js');
const AuthorModel = require('./AuthorModel.js');

const databaseInstantiationPayload = {
    identifiers:  [ "authors" ],
    nonCascadeDeletions: [ "authors" ],
    dataPayloads: [
        {
            identifier: "authors",
            data: [
                {
                    "first_name": "Jace",
                    "last_name": "flow",
                    "biography": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis bibendum, odio id tristique luctus, lacus leo iaculis tellus, non venenatis enim massa euismod justo. Donec quis luctus risus. Pellentesque consectetur nisl ut scelerisque varius. Sed justo neque, mattis nec nibh non, vulputate hendrerit tellus. Fusce elementum consequat sem, nec ullamcorper dui mollis vitae. Pellentesque porttitor venenatis orci sit amet blandit. Duis sed dapibus orci, nec iaculis nisi. Aenean non sagittis elit. Sed sollicitudin eu ipsum vitae sodales. Integer interdum turpis ex, in vehicula magna consequat auctor. Phasellus vel lectus eget felis iaculis varius in eget velit. Donec ut urna varius, porta turpis ut, interdum massa. Sed non urna iaculis, ultrices ligula id, ultricies lacus. Proin semper efficitur nulla nec egestas. Curabitur a risus sed tortor consectetur aliquam."
                },
                {
                    "first_name": "johannes",
                    "last_name": "bakerson",
                    "biography": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse luctus luctus metus et eleifend. Donec pharetra sem congue elementum venenatis. Nulla vitae odio urna. Ut sit amet eros orci. Praesent dictum ac dui a efficitur. Ut non hendrerit velit, nec mattis dolor. Ut venenatis elit quam, eget pulvinar augue finibus sed. Proin mi magna, venenatis eu sagittis vel, porttitor vel velit. Pellentesque nisl lacus, aliquam quis turpis ac, congue mollis arcu. Suspendisse eu nunc consequat, tincidunt diam eget, ornare diam. Curabitur iaculis vitae erat in eleifend."
                },
                {
                    "first_name": "joesph",
                    "last_name": "howards",
                    "biography": "In semper urna sem, sagittis rutrum magna volutpat in. Vestibulum hendrerit vulputate euismod. Suspendisse ante erat, viverra et dui euismod, semper rhoncus neque. Aenean nulla neque, tempus condimentum faucibus a, dignissim eget magna. Proin ut imperdiet leo, commodo ultricies velit. Sed tempor ipsum eget enim convallis accumsan. Sed a tortor sit amet magna mollis porttitor non eget mauris. Fusce imperdiet augue id tellus laoreet, ac blandit ante ullamcorper. Quisque id varius risus. Sed ullamcorper id ligula at placerat."
                },
                {
                    "first_name": "christian",
                    "last_name": "lewiston",
                    "biography": "Nullam sollicitudin arcu eu dui facilisis, at tempor turpis scelerisque. Suspendisse faucibus volutpat lacus quis auctor. Praesent scelerisque nisl enim, a sodales elit aliquet ac. Sed viverra, eros quis varius cursus, sapien est aliquet metus, id malesuada orci felis vel risus. Praesent mattis, turpis et blandit sollicitudin, arcu nisl efficitur est, at imperdiet ante magna sit amet metus. Pellentesque faucibus quam fermentum, viverra est a, pellentesque tellus. Morbi sed mauris tellus. Suspendisse potenti. Nullam sit amet augue vitae orci tempus rhoncus."
                },
            ]
        }
    ]
};

const DATA_REF = databaseInstantiationPayload.dataPayloads[0].data;
const DATA_LENGTH = databaseInstantiationPayload.dataPayloads[0].data.length;

const data = [
    {
        first_name: "newauthorfirstname",
        last_name: "newauthorlastname",
        biography: "biography"
    },            
    {
        first_name: "secondnewauthorfirstname",
        last_name: "secondnewauthorlastname",
        biography: "secondbiography"
    },
    {
        first_name: "thirdnewauthorfirstname",
        last_name: "thirdnewauthorlastname",
        biography: "thirdbiography"
    },
    {
        first_name: "fourthnewauthorfirstname",
        last_name: "fourthnewauthorlastname",
        biography: "fourthbiography"
    },
    {
        first_name: "fifthnewauthorfirstname",
        last_name: "fifthnewauthorlastname",
        biography: "fifthbiography"
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
    test("\n\tAll authors are present from payload", async () => {
        const keyArrays = databaseControl.getKeyArraysFromMap("authors");
        expect(keyArrays.length > 0).toBe(true);
        let res = await supertest(createServer())
            .get(`/authors?id=[${keyArrays.map((array) => (array[0])).join(",")}]`)
            .expect(200);
        let responseLen = res.body.response.length;
        expect(responseLen === DATA_LENGTH).toBe(true);
        for (let i = 0; i < responseLen; i++) {
            let dataObject = res.body.response[i];
            delete dataObject.author_id;
            dataObject[i] = JSON.stringify(dataObject);
            expect(dataObject[i] === JSON.stringify(DATA_REF[i])).toBe(true);
        }   
    });
});

describe("Validate Single POST", () => {
    test("\n\tSingle POST works on authors table/route", async () => {
        let dataPayload = [ data[0] ];
        let res = await supertest(createServer())
            .post("/authors")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        primaryKeys.push(dataObjectRef.author_id);
        delete dataObjectRef.author_id;
        expect(JSON.stringify(dataPayload[0]) === JSON.stringify(dataObjectRef)).toBe(true);
    })
});

describe("Validate Multiple POST", () => {
    test("\n\tMultiple POST works on authors table/route", async () => {
        let dataPayload = data.slice(1, data.length);
        let res = await supertest(createServer())
            .post("/authors")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            primaryKeys.push(dataObjectRef.author_id);
            delete dataObjectRef.author_id;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});

describe("Validate Single UPDATE", () => {
    test("\n\tSingle UPDATE works on authors table/route", async () => {
        let dataPayload = [ data[0] ];
        let res = await supertest(createServer())
            .put(`/authors?id=[${primaryKeys[0]}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.author_id;
        expect(JSON.stringify(dataPayload[0]) === JSON.stringify(dataObjectRef)).toBe(true);
    });
});

describe("Validate Multiple UPDATE", () => {
    test("\n\tMultiple UPDATE works on authors table/route", async () => {
        let dataPayload = data.slice(1, data.length);
        let res = await supertest(createServer())
            .put(`/authors?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            delete dataObjectRef.author_id;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});

describe("Validate Single DELETE", () => {
    test("\n\tSingle DELETE works on authors table/route", async () => {
        let res = await supertest(createServer())
            .delete(`/authors?id=[${primaryKeys[0]}]`)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === 1).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.author_id;
        expect(JSON.stringify(data[0]) === JSON.stringify(dataObjectRef)).toBe(true);
    });
});

describe("Validate Multiple DELETE", () => {
    test("\n\tMultiple DELETE works on authors table/route", async () => {
        let res = await supertest(createServer())
            .delete(`/authors?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === data.length - 1).toBe(true);
        for (let i = 0; i < data.length - 1; i++) {
            let dataObjectRef = responseRef[i];
            delete dataObjectRef.author_id;
            expect(JSON.stringify(data[i + 1]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});