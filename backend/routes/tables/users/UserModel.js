const ModelInterface = require('../ModelInterface.js');

const columnNames = {
    "user_id": "user_id",
    "username": "username",
    "password": "password",
    "first_name": "first_name",
    "last_name": "last_name",
    "email_address": "email_address",
    "address": "address"
};

const STD_BLACKLIST = [ "\"", "'", "\\", "/" ];

const synchronousConstraintSchema = {
    [columnNames.user_id]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.username]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 8, 32, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.password]: {
        jsType: "string",
        dbType: { 
            type: "varchar",
            bounds: [ "[", 1, 256, "]" ]
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.first_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 2, 32, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.last_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 2, 32, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.email_address]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 128, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.address]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 128, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    }
};

const asynchronousConstraintSchema = {
    [columnNames.user_id]: {
        primaryKey: true,
        unique: false
    },
    [columnNames.username]: {
        primaryKey: false,
        unique: true
    },
    [columnNames.password]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.first_name]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.last_name]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.email_address]: {
        primaryKey: false,
        unique: true
    },
    [columnNames.address]: {
        primaryKey: false,
        unique: false
    }
};

class UserModel extends ModelInterface {
    static tableName = "users";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.user_id,
        columnNames.username,
        columnNames.password,
        columnNames.first_name,
        columnNames.last_name,
        columnNames.email_address,
        columnNames.address
    ];

    static idName = columnNames.user_id;

    static updateableColumns = UserModel.columnNamesArray.slice(1);

    static notNullArray = [ columnNames.username, columnNames.password ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = UserModel;