const ModelInterface = require('../ModelInterface.js');
const StandardLists = require('../../StandardLists.js');
const { alphanumeric } = StandardLists;

const columnNames = {
    "wishlist_id": "wishlist_id",
    "wishlist_name": "wishlist_name",
    "user_id_fkey": "user_id_fkey",
};

const synchronousConstraintSchema = {
    [columnNames.wishlist_id]: {
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
    [columnNames.wishlist_name]: {
        jsType: "string",
        dbType: {
            type: "varchar",
            bounds: [ "[", 1, 64, "]" ]
        },
        blacklist: null,
        whitelist: [...alphanumeric, " ", "-" ],
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
};

const asynchronousConstraintSchema = {
    [columnNames.wishlist_id]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.wishlist_name]: {
        foreignKey: null,
        unique: false
    },
    [columnNames.user_id_fkey]: {
        foreignKey: {
            idName: "user_id",
            tableName: "users"
        },
        unique: false
    }
};

class WishlistModel extends ModelInterface {
    static modelName = "WishlistModel";

    static tableName = "wishlists";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.wishlist_id,
        columnNames.wishlist_name,
        columnNames.user_id_fkey
    ];

    static idName = columnNames.wishlist_id;

    static updateableColumns = WishlistModel.columnNamesArray.slice(1);

    static notNullArray = [ columnNames.wishlist_name, columnNames.user_id_fkey ];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;

}

module.exports = WishlistModel;