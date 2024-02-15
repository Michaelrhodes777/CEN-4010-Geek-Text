const ModelInterface = require('../ModelInterface.js');
const StandardLists = require('../../StandardLists.js');
const { numeric, stdBlacklist } = StandardLists;

const columnNames = {
    "card_id": "card_id",
    "credit_card_number": "credit_card_number",
    "expiration": "expiration",
    "ccv": "ccv",
    "user_id_fkey": "user_id_fkey"
};

const synchronousConstraintSchema = {
    [columnNames.card_id]: {
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
    [columnNames.credit_card_number]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 15, 20, "]" ],
        },
        blacklist: null,
        whitelist: numeric,
        requiredList: null,
        custom: null
    },
    [columnNames.expiration]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 4, 4, "]" ],
        },
        blacklist: null,
        whitelist: numeric,
        requiredList: null,
        custom: null
    },
    [columnNames.ccv]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 3, 4, "]" ],
        },
        blacklist: null,
        whitelist: numeric,
        requiredList: null,
        custom: null
    },
    [columnNames.user_id_fkey]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, "i", "-" ],
        },
        blacklist: null,
        whitelist: null,
        requiredList: null,
        custom: null
    },
};

const asynchronousConstraintSchema = {
    [columnNames.card_id]: {
        primaryKey: true,
        foreignKey: null,
        unique: null,
    },
    // will never be unique due to security
    [columnNames.credit_card_number]: {
        primaryKey: false,
        foreignKey: null,
        unique: null,
    },
    [columnNames.expiration]: {
        primaryKey: false,
        foreignKey: null,
        unique: null,
    },
    [columnNames.ccv]: {
        primaryKey: false,
        foreignKey: null,
        unique: null,
    },
    [columnNames.user_id_fkey]: {
        primaryKey: false,
        foreignKey: {
            "idName": "user_id",
            "tableName": "users"
        },
        unique: null,
    },
};

class CreditCardModel extends ModelInterface {

    static tableName = "credit_cards";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.card_id,
        columnNames.credit_card_number,
        columnNames.expiration,
        columnNames.ccv,
        columnNames.user_id_fkey
    ];

    static idName = columnNames.card_id

    static notNullArray = [ columnNames.credit_card_number, columnNames.expiration, columnNames.ccv ];

    static updateableColumns = CreditCardModel.columnNamesArray.slice(1);

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;
}

module.exports = CreditCardModel;