const ModelInterface = require('../ModelInterface.js');

const columnNames = {
    "publisher_id": "publisher_id",
    "publisher_name": "publisher_name",
    "discount_percent": "discount_percent",
};

const STD_BLACKLIST = [ "\"", "'", "\\", "/" ];

const synchronousConstraintSchema = {
    [columnNames.publisher_id]: {
        jsType: "number",
        dbType: {
            type: "int",
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null
    },
    [columnNames.publisher_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 64, "]" ]
        },
        blacklist: STD_BLACKLIST,
        whitelist: null
    },
    [columnNames.discount_percent]: {
        jsType: "number",
        dbType: { 
            type: "int",
            bounds: [ "[", 1, 99, "]" ]
        },
        blacklist: null,
        whitelist: null
    },
};

const asynchronousConstraintSchema = {
    [columnNames.publisher_id]: {
        primaryKey: true,
        unique: false
    },
    [columnNames.publisher_name]: {
        primaryKey: false,
        unique: true
    },
    [columnNames.discount_percent]: {
        primaryKey: false,
        unique: false
    },
};

class PublisherModel extends ModelInterface {
    static tableName = "publishers";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.publisher_id,
        columnNames.publisher_name,
        columnNames.discount_name
    ];

    static idName = columnNames.publisher_id

    static updateableColumns = PublisherModel.columnNamesArray.slice(1);

    static notNullArray = [ columnNames.publisher_name ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = PublisherModel;