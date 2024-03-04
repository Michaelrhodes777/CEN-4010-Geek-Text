const ModelInterface = require('../ModelInterface.js');
const StandardLists = require('../../StandardLists.js');
const { numeric, lowercase, uppercase, alphabetical, alphanumeric, specialCharacters, alphanumericSpecial, stdBlacklist } = StandardLists;

const columnNames = {
    "user_id": "user_id",
    "username": "username",
    "password": "password",
    "first_name": "first_name",
    "last_name": "last_name",
    "email_address": "email_address",
    "address": "address"
};

const synchronousConstraintSchema = {
    [columnNames.user_id]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null,
        requiredList: null,
        custom: null
    },
    [columnNames.username]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 8, 32, "]" ]
        },
        blacklist: null,
        whitelist: alphanumeric,
        requiredList: null,
        custom: null
    },
    [columnNames.password]: {
        jsType: "string",
        dbType: { 
            type: "varchar",
            bounds: [ "[", 1, 256, "]" ]
        },
        blacklist: null,
        whitelist: alphanumericSpecial,
        requiredList: [ lowercase, uppercase, numeric, specialCharacters ],
        custom: null
    },
    [columnNames.first_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 2, 32, "]" ]
        },
        blacklist: null,
        whitelist: alphabetical,
        requiredList: null,
        custom: null
    },
    [columnNames.last_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 2, 32, "]" ]
        },
        blacklist: null,
        whitelist: alphabetical,
        requiredList: null,
        custom: null
    },
    [columnNames.email_address]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 128, "]" ]
        },
        blacklist: stdBlacklist,
        whitelist: null,
        requiredList: null,
        custom: null
    },
    [columnNames.address]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 128, "]" ]
        },
        blacklist: stdBlacklist,
        whitelist: null,
        requiredList: null,
        custom: null
    }
};

const asynchronousConstraintSchema = {
    [columnNames.user_id]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.username]: {
        foreignKey: null,
        unique: true
    },
    [columnNames.password]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.first_name]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.last_name]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.email_address]: {
        foreignKey: null,
        unique: true
    },
    [columnNames.address]: {
        foreignKey: null,
        unique: false
    }
};

class UserModel extends ModelInterface {
    static modelName = "UserModel";

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