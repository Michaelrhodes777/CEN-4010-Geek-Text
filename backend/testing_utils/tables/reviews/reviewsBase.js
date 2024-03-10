const reviewsBase = {
    identifier: "reviews",
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
        },
        {
            "rating": 5,
            "comment": "An inspiring read about the fight for liberty.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        },
        {
            "rating": 4,
            "comment": "Detailed account of a pivotal historical figure.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        },
        {
            "rating": 4,
            "comment": "Fascinating exploration of linguistic connections.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        },
        {
            "rating": 4,
            "comment": "Insightful analysis of language and culture.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        },
        {
            "rating": 5,
            "comment": "Captivating journey through Eastern Europe.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        },
        {
            "rating": 5,
            "comment": "Interesting blend of travel and sports anecdotes.",
            "book_id_fkey": undefined,
            "user_id_fkey": undefined
        }
    ],
    fkeyReferences: [
        {
            identifier: "users",
            externalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
        },
        {
            identifier: "books",
            externalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
            internalIndexes: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
        }
    ]   
};

module.exports = reviewsBase;