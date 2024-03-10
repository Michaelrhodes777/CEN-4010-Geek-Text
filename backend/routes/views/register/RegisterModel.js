const StandardsLists = require('../../StandardsLists.js');
const { numeric, lowercase, uppercase, alphanumeric, specialCharacters, alphanumericSpecial, stdBlacklist } = StandardsLists;

const columnNames = {
    "username": "username",
    "password": "password",
    "email_address": "email_address"
};

const synchronousConstraintSchema = {
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
    }
};

const asynchronousConstraintSchema = {
    [columnNames.username]: {
        foreignKey: null,
        unique: true
    },
    [columnNames.password]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.email_address]: {
        foreignKey: null,
        unique: true
    }
};

class RegisterModel {
    static uniquenessStringConstructor(Model, columnName) {
        return `SELECT ( "${columnName}" ) FROM ${Model.tableName} WHERE "${columnName}" = $1`;
    }

    static modelType = "view";

    static modelName = "RegisterModel";

    static tableName = "register";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.username,
        columnNames.password,
        columnNames.email_address
    ];

    static keyName = columnNames.username;

    static updateableColumns = [];

    static notNullArray = RegisterModel.columnNamesArray;

    static syncrhonousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;
}

module.exports = RegisterModel;