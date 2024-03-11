const wishlistsE2EBase = {
    identifier: "wishlists",
    data: [
        {
            "wishlist_name": "my primary wishlist",
            "user_id_fkey": undefined
        },
        {
            "wishlist_name": "my comedy wishlist",
            "user_id_fkey": undefined
        },
        {
            "wishlist_name": "my action wishlist",
            "user_id_fkey": undefined
        },
        {
            "wishlist_name": "my primary wishlist",
            "user_id_fkey": undefined
        },
        {
            "wishlist_name": "my science fiction wishlist",
            "user_id_fkey": undefined
        },
        {
            "wishlist_name": "my primary wishlist",
            "user_id_fkey": undefined
        }
    ],
    fkeyReferences: [
        {
            identifier: "users",
            internalIndexes: [ 0, 1, 2, 3, 4, 5 ],
            externalIndexes: [ 0, 0, 0, 1, 1, 2 ]
        }
    ]
};

module.exports = wishlistsE2EBase;