const ModelInterface = require('../ModelInterface.js');

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

const STD_BLACKLIST = [ "\"", "'", "\\", "/" ];

const synchronousConstraintSchema = {
    [columnNames.book_id]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.isbn]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 10, 13, "]" ],
        },
        blacklist: null,
        whitelist: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ]
    },
    [columnNames.book_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 128, "]" ],
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.book_description]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 8, 4096, "]" ],
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.book_price]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.author_id_fkey]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.genre_id_fkey]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.publisher_id_fkey]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 1, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.year_published]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "-", "i", "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.copies_sold]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    }
};

const asynchronousConstraintSchema = {
    [columnNames.book_id]: {
        primaryKey: true,
        unique: false
    },
    [columnNames.isbn]: {
        primaryKey: false,
        unique: true
    },
    [columnNames.book_name]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.book_description]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.book_price]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.author_id_fkey]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.genre_id_fkey]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.publisher_id_fkey]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.year_published]: {
        primaryKey: false,
        unique: false
    },
    [columnNames.copies_sold]: {
        primaryKey: false,
        unique: false
    }
};

class BookModel extends ModelInterface {

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

    static notNullFields = [ columnNames.book_name, columnNames.isbn ];

    static updateableColumns = BookModel.columnNamesArray.slice(1);

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = BookModel;