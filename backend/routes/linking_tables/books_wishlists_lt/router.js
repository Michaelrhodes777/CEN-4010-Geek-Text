const express = require('express');
const router = express.Router();
const BooksWishlistsLTModel = require('./BooksWishlistsLTModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(BooksWishlistsLTModel))
    .get(readController(BooksWishlistsLTModel))
    .put(updateController(BooksWishlistsLTModel))
    .delete(deleteController(BooksWishlistsLTModel));

module.exports = router;