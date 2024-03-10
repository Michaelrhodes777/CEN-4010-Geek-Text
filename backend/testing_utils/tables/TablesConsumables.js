const authorsBase = require('./authors/authorsBase');
const booksBase = require('./books/booksBase.js');
const creditCardsBase = require('./credit_cards/creditCardsBase.js');
const genresBase = require('./genres/genresBase.js');
const publishersBase = require('./publishers/publishersBase.js');
const reviewsBase = require('./reviews/reviewsBase.js');
const usersBase = require('./users/usersBase.js');
const wishlistsBase = require('./wishlists/wishlistsBase.js');

const authorsE2EBase = require('./authors/authorsE2EBase');
const booksE2EBase = require('./books/booksE2EBase.js');
const creditCardsE2EBase = require('./credit_cards/creditCardsE2EBase.js');
const genresE2EBase = require('./genres/genresE2EBase.js');
const publishersE2EBase = require('./publishers/publishersE2EBase.js');
const reviewsE2EBase = require('./reviews/reviewsE2EBase.js');
const usersE2EBase = require('./users/usersE2EBase.js');
const wishlistsE2EBase = require('./wishlists/wishlistsE2EBase.js');


const tableNamesMap = {
    "authors": "authors",
    "books": "books",
    "credit_cards": "credit_cards",
    "genres": "genres",
    "publishers": "publishers",
    "reviews": "reviews",
    "users": "users",
    "wishlists": "wishlists"
};

class TablesConsumables {
    static tableNamesMap = tableNamesMap;
    static idMap = {
        [tableNamesMap.authors]: "author_id",
        [tableNamesMap.books]: "book_id",
        [tableNamesMap.credit_cards]: "card_id",
        [tableNamesMap.genres]: "genre_id",
        [tableNamesMap.publishers]: "publisher_id",
        [tableNamesMap.reviews]: "review_id",
        [tableNamesMap.users]: "user_id",
        [tableNamesMap.wishlists]: "wishlist_id"
    };
    static tablesBaseMap = {
        [tableNamesMap.authors]: authorsBase,
        [tableNamesMap.books]: booksBase,
        [tableNamesMap.credit_cards]: creditCardsBase,
        [tableNamesMap.genres]: genresBase,
        [tableNamesMap.publishers]: publishersBase,
        [tableNamesMap.reviews]: reviewsBase,
        [tableNamesMap.users]: usersBase,
        [tableNamesMap.wishlists]: wishlistsBase      
    };
    static tablesE2EBaseMap = {
        [tableNamesMap.authors]: authorsE2EBase,
        [tableNamesMap.books]: booksE2EBase,
        [tableNamesMap.credit_cards]: creditCardsE2EBase,
        [tableNamesMap.genres]: genresE2EBase,
        [tableNamesMap.publishers]: publishersE2EBase,
        [tableNamesMap.reviews]: reviewsE2EBase,
        [tableNamesMap.users]: usersE2EBase,
        [tableNamesMap.wishlists]: wishlistsE2EBase
    };
}

module.exports = TablesConsumables;