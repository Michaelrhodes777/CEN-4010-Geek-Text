const shoppingCartsLTE2EBase = {
    identifier: "shopping_carts_lt",
    data: [
        {
            "user_id_fkey": undefined,
            "book_id_fkey": undefined,
            "quantity": 1
        },
        {
            "user_id_fkey": undefined,
            "book_id_fkey": undefined,
            "quantity": 1
        },
        {
            "user_id_fkey": undefined,
            "book_id_fkey": undefined,
            "quantity": 1
        },
        {
            "user_id_fkey": undefined,
            "book_id_fkey": undefined,
            "quantity": 1
        },
        {
            "user_id_fkey": undefined,
            "book_id_fkey": undefined,
            "quantity": 1
        },
        {
            "user_id_fkey": undefined,
            "book_id_fkey": undefined,
            "quantity": 1
        }
    ],
    fkeyReferences: [
        {
            identifier: "users",
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6 ],
            externalIndexes: [ 0, 1, 2, 3, 4, 5, 0 ]
        },
        {
            identifier: "books",
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6 ],
            externalIndexes: [ 0, 1, 2, 3, 4, 5, 0 ]
        }
    ]
};

module.exports = shoppingCartsLTE2EBase;