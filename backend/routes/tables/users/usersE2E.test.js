const supertest = require('supertest');
const DatabaseControl = require('../../../testing_utils/DatabaseControl.js');
const { clientFactory } = require('../../../database/setupFxns.js');
const createServer = require('../../../util/createServer.js');
const UserModel = require('./UserModel.js');

const databaseInstantiationPayload = {
    identifiers:  [ "users" ],
    nonCascadeDeletions: [ "users" ],
    dataPayloads: [
        {
            identifier: "users",
            data: [
                {
                    "username": "tigerlily88",
                    "password": "Sunshine@123!",
                    "first_name": "Sarah",
                    "last_name": "Smith",
                    "email_address": "sarah.smith@example.com",
                    "address": "123 Maple Avenue",
                  },
                  {
                    "username": "rocketman",
                    "password": "SpaceX2023!",
                    "first_name": "John",
                    "last_name": "Doe",
                    "email_address": "john.doe@email.com",
                    "address": "456 Elm Street",
                  },
                  {
                    "username": "purpleunicorn",
                    "password": "Magic@321!",
                    "first_name": "Alice",
                    "last_name": "Anderson",
                    "email_address": "alice.anderson@example.com",
                    "address": "789 Pine Road",
                }
            ]
        }
    ]
};



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
        username: "firstusername",
        password: "firstpassword",
        first_name: "firstfirstname",
        last_name: "firstlastname",
        email_address: "firstemail@example.com",
        address: "123 first address",
     
    },            
    {
        username: "secondusername",
        password: "secondpassword",
        first_name: "secondfirstname",
        last_name: "secondlastname",
        email_address: "secondemail@example.com",
        address: "123 second address",
      
    },
    {
        username: "thirdusername",
        password: "thirdpassword",
        first_name: "thirdfirstname",
        last_name: "thirdlastname",
        email_address: "thirdemail@example.com",
        address: "123 third address",
       
    },
    {
        username: "fourthusername",
        password: "fourthpassword",
        first_name: "fourthfirstname",
        last_name: "fourthlastname",
        email_address: "fourthemail@example.com",
        address: "123 fourth address",
       
    },
    {
        username: "fifthusername",
        password: "fifthpassword",
        first_name: "fifthfirstname",
        last_name: "fifthlastname",
        email_address: "fifthemail@example.com",
        address: "123 fifth address",
      
    }
];

describe("Validate correct database instantiation and GET functionality", () => {
    test("\n\tAll Users are present from payload", async () => {
        let res = await supertest(createServer())
            .get(`/users?id=[${databaseControl.getKeyArraysFromMap("users").map((array) => (array[0])).join(",")}]`)
            .expect(200);
        let responseLen = res.body.response.length;
        // console.log("Response Length:", responseLen);
        // console.log("Response Body:", res.body.response);
        // console.log("Expected Data:", DATA_REF);
        expect(responseLen === DATA_LENGTH).toBe(true);
        for (let i = 0; i < responseLen; i++) {
            let dataObject = res.body.response[i];
            let expectedObject = {
                username: DATA_REF[i].username,
                password: DATA_REF[i].password,
                first_name: DATA_REF[i].first_name,
                last_name: DATA_REF[i].last_name,
                email_address: DATA_REF[i].email_address,
                address: DATA_REF[i].address
            };
            delete dataObject.user_id;
            delete dataObject.refresh_token;
            delete dataObject.role;
            // console.log("\nData Object After Deletion:", dataObject);
            // console.log("Expected Object:", expectedObject);
            let dataStringified = JSON.stringify(dataObject);
            let expectedStringified = JSON.stringify(expectedObject);
            // console.log("Data Object Stringified:", dataStringified);
            // console.log("Expected Object Stringified:", expectedStringified);
            // Check for stringified equality
            expect(dataStringified === expectedStringified).toBe(true);
        }
    });
});

describe("Validate Single POST", () => {
    test("\n\tSingle POST works on users table/route", async () => {
        let dataPayload = [data[0]];
        let res = await supertest(createServer())
            .post("/users")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        primaryKeys.push(dataObjectRef.user_id);
        delete dataObjectRef.user_id;
        delete dataObjectRef.refresh_token;
        delete dataObjectRef.role;
        // console.log("Data Payload:", JSON.stringify(dataPayload[0]));
        // console.log("Data Object Ref:", JSON.stringify(dataObjectRef));
        expect(JSON.stringify(dataPayload[0]) === JSON.stringify(dataObjectRef)).toBe(true);
    });
});

describe("Validate Multiple POST", () => {
    test("\n\tMultiple POST works on user table/route", async () => {
        let dataPayload = [
            {
                username: "updated_secondusername",
                password: "updated_secondpassword",
                first_name: "updated_secondfirstname",
                last_name: "updated_secondlastname",
                email_address: "updated_secondemail@example.com",
                address: "123 updated second address",
            },
            {
                username: "updated_thirdusername",
                password: "updated_thirdpassword",
                first_name: "updated_thirdfirstname",
                last_name: "updated_thirdlastname",
                email_address: "updated_thirdemail@example.com",
                address: "123 updated third address",
            },
            {
                username: "updated_fourthusername",
                password: "updated_fourthpassword",
                first_name: "updated_fourthfirstname",
                last_name: "updated_fourthlastname",
                email_address: "updated_fourthemail@example.com",
                address: "123 updated fourth address",
            },
            {
                username: "updated_fifthusername",
                password: "updated_fifthpassword",
                first_name: "updated_fifthfirstname",
                last_name: "updated_fifthlastname",
                email_address: "updated_fifthemail@example.com",
                address: "123 updated fifth address",
            }
        ];
        let updateIds = primaryKeys.slice(1, primaryKeys.length).join(",");
        let res = await supertest(createServer())
            .post("/users")
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            primaryKeys.push(dataObjectRef.user_id);
            delete dataObjectRef.user_id;
            delete dataObjectRef.refresh_token;
            delete dataObjectRef.role;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});


describe("Validate Single UPDATE", () => {
    test("\n\tSingle UPDATE works on users table/route", async () => {
        // Modify the data for update, change username and email_address
        let updatedData = {
            ...data[0],
            username: "newusername123",
            email_address: "newemail@example.com"
        };
        let dataPayload = [updatedData];
        let res = await supertest(createServer())
            .put(`/users?id=[${primaryKeys[0]}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        let dataObjectRef = responseRef[0];
        delete dataObjectRef.user_id;
        delete dataObjectRef.refresh_token;
        delete dataObjectRef.role;
        expect(JSON.stringify(updatedData) === JSON.stringify(dataObjectRef)).toBe(true);
    });
});

describe("Validate Multiple UPDATE", () => {
    test("\n\tMultiple UPDATE works on users table/route", async () => {
        let dataPayload = data.slice(1, data.length);
        let res = await supertest(createServer())
            .put(`/users?id=[${primaryKeys.slice(1, primaryKeys.length).join(",")}]`)
            .send(dataPayload)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === dataPayload.length).toBe(true);
        for (let i = 0; i < dataPayload.length; i++) {
            let dataObjectRef = responseRef[i];
            delete dataObjectRef.user_id;
            delete dataObjectRef.refresh_token;
            delete dataObjectRef.role;
            expect(JSON.stringify(dataPayload[i]) === JSON.stringify(dataObjectRef)).toBe(true);
        }
    })
});


describe("Validate Single DELETE", () => {
    test("\n\tSingle DELETE works on users table/route", async () => {
        let res = await supertest(createServer())
            .delete(`/users?id=[${primaryKeys[0]}]`)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === 1).toBe(true); // Only one user should be in the response
        let deletedUser = responseRef[0];
        let expectedDeletedUser = {
            "address": "123 first address",
            "email_address": "newemail@example.com",
            "first_name": "firstfirstname",
            "last_name": "firstlastname",
            "password": "firstpassword",
            "username": "newusername123",
        };
            delete deletedUser.user_id;
                delete deletedUser.refresh_token;
                delete deletedUser.role;
    
        expect(deletedUser).toEqual(expectedDeletedUser);
    })
 });

describe("Validate Multiple DELETE", () => {
    test("\n\tMultiple DELETE works on users table/route", async () => {
        let deleteIds = primaryKeys.slice(1).join(","); // Exclude the first user
        let res = await supertest(createServer())
            .delete(`/users?id=[${deleteIds}]`)
            .expect(200);
        let responseRef = res.body.response;
        expect(responseRef.length === primaryKeys.length - 1).toBe(true);
        for (let i = 0; i < responseRef.length; i++) {
            let deletedUser = responseRef[i];
            let expectedDeletedUser = data[i + 1];
            delete deletedUser.user_id;
            delete deletedUser.refresh_token;
            delete deletedUser.role;
            expect(deletedUser).toEqual(expectedDeletedUser);
        }
    })
 });


