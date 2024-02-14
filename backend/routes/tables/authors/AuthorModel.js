const ModelInterface = require('../ModelInterface.js');
const StandardLists = require('../StandardLists.js');
const { alphabetical, stdBlacklist } = StandardLists;

const columnNames = {
    "author_id": "author_id",
    "first_name": "first_name",
    "last_name": "last_name",
    "biography": "biography"
};

const synchronousConstraintSchema = {
    [columnNames.author_id]: {
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
    [columnNames.first_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 32, "]" ]
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
            bounds: [ "[", 1, 32, "]" ]
        },
        blacklist: null,
        whitelist: alphabetical,
        requiredList: null,
        custom: null
    },
    [columnNames.biography]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 8, 4096, "]" ]
        },
        blacklist: stdBlacklist,
        whitelist: null,
        requiredList: null,
        custom: null
    }
};

const asynchronousConstraintSchema = {
    [columnNames.author_id]: {
        primaryKey: true,
        foreignKey: null,
        unique: false
    },
    [columnNames.first_name]: {
        primaryKey: false,
        foreignKey: null,
        unique: false
    },
    [columnNames.last_name]: {
        primaryKey: false,
        foreignKey: null,
        unique: false
    },
    [columnNames.biography]: {
        primaryKey: false,
        foreignKey: null,
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

    static notNullArray = [ columnNames.first_name, columnNames.last_name ];

    static updateableColumns = AuthorModel.columnNamesArray.slice(1);

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = AuthorModel;