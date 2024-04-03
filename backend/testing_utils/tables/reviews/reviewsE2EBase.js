const reviewsBase = require('./reviewsBase.js');

const reviewsE2EBase = {
    identifier: reviewsBase.identifier,
    data: [
        {
            "rating": 5,
            "comment": "A fascinating insight into the life of Philip Doddridge.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        },
        {
            "rating": 4,
            "comment": "Well-written biography with great historical context.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        },
        {
            "rating": 4,
            "comment": "Interesting travel memoir.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        },
        {
            "rating": 4,
            "comment": "Provides a unique perspective on Dahomey.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        }
    ],
    fkeyReferences: [
        {
            identifier: "users",
            externalIndexes: [ 0, 1, 2, 3 ],
            internalIndexes: [ 0, 1, 2, 3 ]
        },
        {
            identifier: "books",
            externalIndexes: [ 0, 1, 2, 3 ],
            internalIndexes: [ 0, 1, 2, 3 ]
        }
    ]
};

module.exports = reviewsE2EBase;