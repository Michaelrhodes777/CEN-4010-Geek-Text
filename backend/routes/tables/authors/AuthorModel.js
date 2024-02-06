const ModelInterface = require('../ModelInterface.js');

const columnNames = {
    "author_id": "author_id",
    "first_name": "first_name",
    "last_name": "last_name",
    "biography": "biography"
};

const STD_BLACKLIST = [ "\"", "'", "\\", "/" ];

const synchronousConstraintSchema = {
    [columnNames.author_id]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.first_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 32, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.last_name]: {
        jsType: "string",
        dbType: { 
            type: "varchar",
            bounds: [ "[", 1, 32, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.biography]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 8, 4096, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    }
};

const asynchronousConstraintSchema = {
    [columnNames.author_id]: {
        primaryKey: true,
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
    [columnNames.biography]: {
        primaryKey: false,
        unique: false
    }
};

class AuthorModel extends ModelInterface {

    static tableName = "authors";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.author_id,
        columnNames.first_name,
        columnNames.last_name,
        columnNames.biography
    ];

    static idName = columnNames.author_id

    static notNullFields = [ columnNames.first_name, columnNames.last_name ];

    static updateableColumns = AuthorModel.columnNamesArray.slice(1);

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = AuthorModel;