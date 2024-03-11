const ModelLTInterface = require('../ModelLTInterface.js');

const columnNames = {
    "user_id_fkey": "user_id_fkey",
    "book_id_fkey": "book_id_fkey",
    "quantity": "quantity"
};

const synchronousConstraintSchema = {
    [columnNames.user_id_fkey]: {
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
    [columnNames.book_id_fkey]: {
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
    [columnNames.quantity]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, 100, "]" ],
        },
        blacklist: null,
        whitelist: null,
        requiredList: null,
        custom: null
    }
};

const asynchronousConstraintSchema = {
    [columnNames.user_id_fkey]: {
        foreignKey: {
            "idName": "user_id",
            "tableName": "users"
        },
        unique: null,
    },
    [columnNames.book_id_fkey]: {
        foreignKey: {
            "idName": "book_id",
            "tableName": "books"
        },
        unique: null,
    },
    [columnNames.quantity]: {
        foreignKey: null,
        unique: null,
    }
};

class ShoppingCartsLTModel extends ModelLTInterface {

    static modelName = "ShoppingCartsLTModel";

    static tableName = "shopping_carts_lt";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.user_id_fkey,
        columnNames.book_id_fkey,
        columnNames.quantity
    ];

    static compositePkeys = [ columnNames.user_id_fkey, columnNames.book_id_fkey ];

    static queryablePkey = columnNames.user_id_fkey;

    static notNullArray = [ columnNames.user_id_fkey, columnNames.book_id_fkey, columnNames.quantity ];

    static updateableColumns = [ columnNames.quantity ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;
}

module.exports = ShoppingCartsLTModel;