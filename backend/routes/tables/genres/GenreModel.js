const ModelInterface = require('../ModelInterface.js');
const StandardLists = require('../../StandardLists.js');
const { stdBlacklist } = StandardLists;

const columnNames = {
    "genre_id": "genre_id",
    "genre_name": "genre_name"
};


const synchronousConstraintSchema = {
    [columnNames.genre_id]: {
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
    [columnNames.genre_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 32, "]" ]
        },
        blacklist: stdBlacklist,
        whitelist: null,
        requiredList: null,
        custom: null
    },
};

const asynchronousConstraintSchema = {
    [columnNames.genre_id]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.genre_name]: {
        foreignKey: null,
        unique: true
    },
};

class GenreModel extends ModelInterface {
    static tableName = "genres";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.genre_id,
        columnNames.genre_name
    ];

    static idName = columnNames.genre_id;

    static updateableColumns = GenreModel.columnNamesArray.slice(1);

    static notNullArray = [ columnNames.genre_name ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = GenreModel;