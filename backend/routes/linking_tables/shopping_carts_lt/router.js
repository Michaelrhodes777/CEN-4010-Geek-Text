const express = require('express');
const router = express.Router();
const ShoppingCartsLTModel = require('./BooksWishlistsLTModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(ShoppingCartsLTModel))
    .get(readController(ShoppingCartsLTModel))
    .put(updateController(ShoppingCartsLTModel))
    .delete(deleteController(ShoppingCartsLTModel));

module.exports = router;