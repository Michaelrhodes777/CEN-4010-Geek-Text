const shoppingCartsLTBase = {
    identifier: "shopping_carts_lt",
    data: [
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        },
        {
            user_id_fkey: undefined,
            book_id_fkey: undefined,
            quantity: 1
        }
    ],
    fkeyReferences: [
        {
            identifier: "users",
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
            externalIndexes: [ 0, 0, 1, 1, 1, 2, 3, 3, 3, 3, 3  ]
        },
        {
            identifier: "books",
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
            externalIndexes: [ 0, 1, 2, 3, 4, 4, 0, 1, 2, 3, 4 ]
        }
    ]
};

module.exports = shoppingCartsLTBase;