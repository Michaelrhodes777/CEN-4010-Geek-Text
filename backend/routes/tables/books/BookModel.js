const ModelInterface = require('../ModelInterface.js');
const StandardLists = require('../../StandardLists.js');
const { numeric, stdBlacklist } = StandardLists;

const columnNames = {
    "book_id": "book_id",
    "isbn": "isbn",
    "book_name": "book_name",
    "book_description": "book_description",
    "book_price": "book_price",
    "author_id_fkey": "author_id_fkey",
    "genre_id_fkey": "genre_id_fkey",
    "publisher_id_fkey": "publisher_id_fkey",
    "year_published": "year_published",
    "copies_sold": "copies_sold"
};

const synchronousConstraintSchema = {
    [columnNames.book_id]: {
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
    [columnNames.isbn]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 10, 13, "]" ],
        },
        blacklist: null,
        whitelist: numeric,
        requiredList: null,
        custom: null
    },
    [columnNames.book_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 256, "]" ],
        },
        blacklist: stdBlacklist,
        whitelist: null,
        requiredList: null,
        custom: null
    },
    [columnNames.book_description]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 4096, "]" ],
        },
        blacklist: stdBlacklist,
        whitelist: null,
        requiredList: null,
        custom: null
    },
    [columnNames.book_price]: {
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
    [columnNames.author_id_fkey]: {
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
    [columnNames.genre_id_fkey]: {
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
    [columnNames.publisher_id_fkey]: {
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
    [columnNames.year_published]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "-", "i", "i", "-" ],
        },
        blacklist: null,
        whitelist: null,
        requiredList: null,
        custom: null
    },
    [columnNames.copies_sold]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null,
        requiredList: null,
        custom: null
    }
};

const asynchronousConstraintSchema = {
    [columnNames.book_id]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.isbn]: {
        foreignKey: null,
        unique: true
    },
    [columnNames.book_name]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.book_description]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.book_price]: {
        primaryKey: false,
        foreignKey: null,
        unique: false
    },
    [columnNames.author_id_fkey]: {
        foreignKey: {
            idName: "author_id",
            tableName: "authors"
        },
        unique: false
    },
    [columnNames.genre_id_fkey]: {
        foreignKey: {
            idName: "genre_id",
            tableName: "genres"
        },
        unique: false
    },
    [columnNames.publisher_id_fkey]: {
        foreignKey: {
            idName: "publisher_id",
            tableName: "publishers"
        },
        unique: false
    },
    [columnNames.year_published]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.copies_sold]: {
        foreignKey: null,
        unique: false
    }
};

class BookModel extends ModelInterface {
    static modelName = "BookModel";

    static tableName = "books";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.book_id,
        columnNames.isbn,
        columnNames.book_name,
        columnNames.book_description,
        columnNames.book_price,
        columnNames.author_id_fkey,
        columnNames.genre_id_fkey,
        columnNames.publisher_id_fkey,
        columnNames.year_published,
        columnNames.copies_sold
    ];

    static idName = columnNames.book_id;

    static notNullArray = [ columnNames.book_name, columnNames.isbn ];

    static updateableColumns = BookModel.columnNamesArray.slice(1);

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = BookModel;