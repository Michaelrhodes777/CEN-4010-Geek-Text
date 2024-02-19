const ModelInterface = require('../ModelInterface.js');
const StandardLists = require('../../StandardLists.js');
const { stdBlacklist, datestampWhitelist } = StandardLists;

const columnNames = {
    "review_id": "review_id",
    "rating": "rating",
    "comment": "comment",
    "datestamp": "datestamp",
    "user_id_fkey": "user_id_fkey",
    "book_id_fkey": "book_id_fkey"
};

const synchronousConstraintSchema = {
    [columnNames.review_id]: {
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
    [columnNames.rating]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, 5, "]" ]
        },
        blacklist: null,
        whitelist: null,
        requiredList: null,
        custom: null
    },
    [columnNames.comment]: {
        jsType: "string",
        dbType: { 
            type: "varchar",
            bounds: [ "[", 0, 4096, "]" ]
        },
        blacklist: stdBlacklist,
        whitelist: null,
        requiredList: null,
        custom: null
    },
    [columnNames.datestamp]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 0, 16, "]" ]
        },
        blacklist: null,
        whitelist: datestampWhitelist,
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
    [columnNames.book_id_fkey]: {
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
    [columnNames.review_id]: {
        primaryKey: true,
        foreignKey: null,
        unique: false
    },
    [columnNames.rating]: {
        primaryKey: false,
        foreignKey: null,
        unique: false
    },
    [columnNames.comment]: {
        primaryKey: false,
        foreignKey: null,
        unique: false
    },
    [columnNames.datestamp]: {
        primaryKey: false,
        foreignKey: null,
        unique: false
    },
    [columnNames.user_id_fkey]: {
        primaryKey: false,
        foreignKey: {
            idName: "user_id",
            tableName: "users"
        },
        unique: false
    },
    [columnNames.book_id_fkey]: {
        primaryKey: false,
        foreignKey: {
            idName: "book_id",
            tableName: "books"
        },
        unique: false
    },
};

class ReviewModel extends ModelInterface {
    static tableName = "reviews";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.review_id,
        columnNames.rating,
        columnNames.comment,
        columnNames.datestamp,
        columnNames.user_id_fkey,
        columnNames.book_id_fkey
    ];

    static idName = columnNames.review_id;

    static updateableColumns = ReviewModel.columnNamesArray.slice(1);

    static notNullArray = [ columnNames.rating, columnNames.user_id_fkey, columnNames.book_id_fkey ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = ReviewModel;