const booksE2EBase = {
    identifier: "books",
    data: [
        {
            "copies_sold": 729,
            "isbn": "2597888810",
            "publisher_id_fkey": undefined,
            "book_name": "The wholesale grocery business in January, 1921",
            "book_price": 1458,
            "genre_id_fkey": undefined,
            "author_id_fkey": undefined,
            "year_published": 1921,
            "book_description": "12 p 19 cm"
        },
        {
            "copies_sold": 527,
            "isbn": "1049681028",
            "publisher_id_fkey": undefined,
            "book_name": "The magic shadow show",
            "book_price": 1054,
            "genre_id_fkey": undefined,
            "author_id_fkey": undefined,
            "year_published": 1913,
            "book_description": "32 p"
        },
        {
            "copies_sold": 758,
            "isbn": "6977145820",
            "publisher_id_fkey": undefined,
            "book_name": "Decay of rationalism",
            "book_price": 1516,
            "genre_id_fkey": undefined,
            "author_id_fkey": undefined,
            "year_published": 1910,
            "book_description": "Thesis (Ph.D.)--University of Pennsylvania, 1910"
        },
        {
            "copies_sold": 1022,
            "isbn": "1042944485",
            "publisher_id_fkey": undefined,
            "book_name": "Descriptive astronomy; an elementary exposition of the facts, principles, and theories of astronomical science",
            "book_price": 2044,
            "genre_id_fkey": undefined,
            "author_id_fkey": undefined,
            "year_published": 1912
        },
        {
            "copies_sold": 942,
            "isbn": "1048794371",
            "publisher_id_fkey": undefined,
            "book_name": "Mental physiology, especially in its relations to mental disorders",
            "book_price": 1884,
            "genre_id_fkey": undefined,
            "author_id_fkey": undefined,
            "year_published": 1895,
            "book_description": "xv, 552 p"
        },
        {
            "copies_sold": 637,
            "isbn": "1040007067",
            "publisher_id_fkey": undefined,
            "book_name": "A ragged register (of people, places and opinions).",
            "book_price": 1274,
            "genre_id_fkey": undefined,
            "author_id_fkey": undefined,
            "year_published": 1879
        }
    ],
    fkeyReferences: [
        {
            identifier: "authors",
            internalIndexes: [ 0, 1, 2, 3, 4, 5 ],
            externalIndexes: [ 0, 0, 1, 1, 2, 3 ]
        },
        {
            identifier: "publishers",
            internalIndexes: [ 0, 1, 2, 3, 4, 5 ],
            externalIndexes: [ 0, 0, 1, 1, 2, 2 ]
        },
        {
            identifier: "genres",
            internalIndexes: [ 0, 1, 2, 3, 4, 5 ],
            externalIndexes: [ 0, 0, 1, 2, 3, 4 ]
        },
    ]
};

module.exports = booksE2EBase;