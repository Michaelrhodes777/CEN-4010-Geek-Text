const booksWishlistsLTBase = require('./books_wishlists_lt/booksWishlistsLTBase.js');
const shoppingCartsLTBase = require('./shopping_carts_lt/shoppingCartsLTBase.js');

const booksWishlistsLTE2EBase = require('./books_wishlists_lt/booksWishlistsLTE2EBase.js');
const shoppingCartsLTE2EBase = require('./shopping_carts_lt/shoppingCartsLTE2EBase.js');

const linkingTablesNamesMap = {
    "books_wishlists_lt": "books_wishlists_lt",
    "shopping_carts_lt": "shopping_carts_lt"
};

class LinkingTablesConsumables {
    static linkingTablesNamesMap = linkingTablesNamesMap;
    static linkingTablesBaseMap = {
        [linkingTablesNamesMap.books_wishlists_lt]: booksWishlistsLTBase,
        [linkingTablesNamesMap.shopping_carts_lt]: shoppingCartsLTBase
    };
    static linkingTablesE2EBaseMap = {
        [linkingTablesNamesMap.books_wishlists_lt]: booksWishlistsLTE2EBase,
        [linkingTablesNamesMap.shopping_carts_lt]: shoppingCartsLTE2EBase
    };
}

module.exports = LinkingTablesConsumables;