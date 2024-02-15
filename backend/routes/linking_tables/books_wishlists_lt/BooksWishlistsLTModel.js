const ModelLTInterface = require('../ModelLTInterface.js');

const columnNames = {
    "book_id_fkey": "book_id_fkey",
    "wishlist_id_fkey": "wishlist_id_fkey"
};

const synchronousConstraintSchema = {
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
    [columnNames.book_id_fkey]: {
        primaryKey: false,
        foreignKey: {
            "idName": "book_id",
            "tableName": "books"
        },
        unique: null,
    },
    [columnNames.wishlist_id_fkey]: {
        primaryKey: false,
        foreignKey: {
            "idName": "wishlist_id",
            "tableName": "wishlists"
        },
        unique: null,
    },
};

class BooksWishlistsLTModel extends ModelLTInterface {

    static tableName = "books_wishlists_lt";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.book_id_fkey,
        columnNames.wishlist_id_fkey
    ];

    static idName = null

    static notNullArray = [ columnNames.book_id_fkey, columnNames.wishlist_id_fkey ];

    static updateableColumns = columnNames;

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;
}

module.exports = BooksWishlistsLTModel;