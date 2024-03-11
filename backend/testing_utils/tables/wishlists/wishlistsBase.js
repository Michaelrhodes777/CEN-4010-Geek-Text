const wishlistsBase = {
    identifier: "wishlists",
    data: [
        {
            "user_id_fkey": undefined,
            "wishlist_name": "my documentary wishlist 1"
        },
        {
            "user_id_fkey": undefined,
            "wishlist_name": "my comedy wishlist 1"
        },
        {
            "user_id_fkey": undefined,
            "wishlist_name": "my war wishlist 1"
        },
        {
            "user_id_fkey": undefined,
            "wishlist_name": "my animation wishlist 1"
        },
        {
            "user_id_fkey": undefined,
            "wishlist_name": "my drama wishlist 1"
        },
        {
            "user_id_fkey": undefined,
            "wishlist_name": "my action wishlist 1"
        }
    ],
    fkeyReferences: [
        {
            identifier: "users",
            externalIndexes: [ 0, 1, 2, 3, 4, 5 ],
            internalIndexes: [ 0, 1, 2, 3, 4, 5 ]
        }
    ]
};

module.exports = wishlistsBase;