const columnNames = {
    "wishlist_id": "wishlist_id",
    "wishlist_name": "wishlist_name",
    "user_id_fkey": "user_id_fkey",
};

class WishlistModel {
    static tableName = "wishlists";

    static columnNamesMap = columnNames;

    static columnNamesArray = [
        columnNames.wishlist_id,
        columnNames.wishlist_name,
        columnNames.user_id_fkey
    ];

    static idName = columnNames.wishlist_id;

    static updateableColumns = WishlistModel.columnNamesArray.slice(1);
}

module.exports = WishlistModel;