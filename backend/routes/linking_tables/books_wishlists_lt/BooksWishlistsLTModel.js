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
            bounds: [ "[", 0, "i", "-" ],
        },
        blacklist: null,
        whitelist: null,
        requiredList: null,
        custom: null
    },
    [columnNames.wishlist_id_fkey]: {
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
};

const asynchronousConstraintSchema = {
    [columnNames.book_id_fkey]: {
        foreignKey: {
            "idName": "book_id",
            "tableName": "books"
        },
        unique: null,
    },
    [columnNames.wishlist_id_fkey]: {
        foreignKey: {
            "idName": "wishlist_id",
            "tableName": "wishlists"
        },
        unique: null,
    },
};

class BooksWishlistsLTModel extends ModelLTInterface {

    static modelName = "BooksWishlistsLTModel";

    static tableName = "books_wishlists_lt";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.book_id_fkey,
        columnNames.wishlist_id_fkey
    ];

    static compositePkeys = [ columnNames.book_id_fkey, columnNames.wishlist_id_fkey ];

    static queryablePkey = columnNames.wishlist_id_fkey;

    static notNullArray = [ columnNames.book_id_fkey, columnNames.wishlist_id_fkey ];

    static updateableColumns = [];

    static synchronousConstraintSchema = synchronousConstraintSchema;

    static asynchronousConstraintSchema = asynchronousConstraintSchema;
}

module.exports = BooksWishlistsLTModel;