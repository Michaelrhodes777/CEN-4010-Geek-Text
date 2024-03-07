const ModelInterface = require('../ModelInterface.js');
const StandardLists = require('../../StandardLists.js');
const { numeric, lowercase, uppercase, alphabetical, alphanumeric, specialCharacters, alphanumericSpecial, stdBlacklist } = StandardLists;

const columnNames = {
    "username": "username",
    "password": "password",
    "first_name": "first_name",
    "last_name": "last_name",
    "address": "address"
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
    [columnNames.address]: {
        foreignKey: null,
        unique: false
    }
};

class EditUserDataModel {
    static uniquenessStringConstructor(Model, columnName) {
        return `SELECT ( "${columnName}" ) FROM ${Model.tableName} WHERE "${columnName}" = $1`;
    }

    static modelName = "EditUserDataModel";

    static tableName = "edit_user_data";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.username,
        columnNames.password,
        columnNames.first_name,
        columnNames.last_name,
        columnNames.address
    ];

    static keyName = columnNames.username;

    static updateableColumns = EditUserDataModel.columnNamesArray;

    static notNullArray = [ columnNames.username, columnNames.password, columnNames.email_address ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;
}

module.exports = EditUserDataModel;