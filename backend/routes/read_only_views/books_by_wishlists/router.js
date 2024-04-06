const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

router.route("/:wishlist_id")
    .get(getViewByIdController("books_by_wishlists"));

module.exports = router;