const AuthorModel = require('../../routes/tables/authors/AuthorModel.js');
const BookModel = require('../../routes/tables/books/BookModel.js');
const CreditCardModel = require('../../routes/tables/credit_cards/CreditCardModel.js');
const GenreModel = require('../../routes/tables/genres/GenreModel.js');
const PublisherModel = require('../../routes/tables/publishers/PublisherModel.js');
const ReviewModel = require('../../routes/tables/reviews/ReviewModel.js');
const UserModel = require('../../routes/tables/users/UserModel.js');
const WishlistModel = require('../../routes/tables/wishlists/WishlistModel.js');

const Models = {
    AuthorModel,
    BookModel,
    CreditCardModel,
    GenreModel,
    PublisherModel,
    ReviewModel,
    UserModel,
    WishlistModel
};

const ModelIterable = [
    AuthorModel,
    BookModel,
    CreditCardModel,
    GenreModel,
    PublisherModel,
    ReviewModel,
    UserModel,
    WishlistModel  
];

const tableNames = ModelIterable.map((Model) => (Model.tableName));

module.exports = {
    Models,
    ModelIterable,
    tableNames
};