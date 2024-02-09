const ModelInterface = require('../ModelInterface.js');

const columnNames = {
    "review_id": "review_id",
    "rating": "rating",
    "comment": "comment",
    "datestamp": "datestamp",
    "user_id_fkey": "user_id_fkey",
    "book_id_fkey": "book_id_fkey"
};

const STD_BLACKLIST = [ "\"", "'", "\\", "/" ];

const synchronousConstraintSchema = {
    [columnNames.review_id]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.rating]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, 5, "]" ]
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.comment]: {
        jsType: "string",
        dbType: { 
            type: "varchar",
            bounds: [ "[", 0, 4096, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.datestamp]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 0, 16, "]" ]
        },
        blacklist: null,
        whitelist: [ "/", "-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ]
    },
    [columnNames.user_id_fkey]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.book_id_fkey]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
};

const asynchronousConstraintSchema = {
    [columnNames.review_id]: {
        primaryKey: true,
        unique: false
    },
    [columnNames.rating]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.comment]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.datestamp]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.user_id_fkey]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.book_id_fkey]: {
        primaryKey: false,
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

    static notNullArray = [ columnNames.rating, columnNames.datestamp, columnNames.user_id_fkey, columnNames.book_id_fkey ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = ReviewModel;