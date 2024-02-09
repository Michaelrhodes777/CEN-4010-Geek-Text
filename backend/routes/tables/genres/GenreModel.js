const ModelInterface = require('../ModelInterface.js');

const columnNames = {
    "genre_id": "genre_id",
    "genre_name": "genre_name"
};

const STD_BLACKLIST = [ "\"", "'", "\\", "/" ];

const synchronousConstraintSchema = {
    [columnNames.genre_id]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.genre_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 32, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
};

const asynchronousConstraintSchema = {
    [columnNames.genre_id]: {
        primaryKey: true,
        unique: false
    },
    [columnNames.genre_name]: {
        primaryKey: false,
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