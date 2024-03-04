const BooksWishlistsLTModel = require('../../routes/linking_tables/books_wishlists_lt/BooksWishlistsLTModel.js');
const ShoppingCartsLTModel = require('../../routes/linking_tables/shopping_carts_lt/ShoppingCartsLTModel.js');

const Models = {
    BooksWishlistsLTModel,
    ShoppingCartsLTModel
};

const ModelIterable = [
    BooksWishlistsLTModel,
    ShoppingCartsLTModel
];

module.exports = {
    Models,
    ModelIterable
};