const booksWishlistsLTBase = {
    identifier: "books_wishlists_lt",
    data: [
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
        {
            book_id_fkey: undefined,
            wishlist_id_fkey: undefined
        },
    ],
    fkeyReferences: [
        {
            identifier: "books",
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
            externalIndexes: [ 0, 1, 2, 0, 1, 2, 3, 4, 5, 6 ]
        },
        {
            identifier: "wishlists",
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
            externalIndexes: [ 0, 0, 0, 1, 1, 1, 2, 2, 3, 4 ]
        }
    ]            
};

module.exports = booksWishlistsLTBase;