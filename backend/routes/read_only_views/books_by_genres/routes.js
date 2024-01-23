const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

router.route("/by_genre_name/:genre_name")
    .get(getViewByIdController("books_by_genres"));
router.route("/by_genre_id/:genre_id")
    .get(getViewByIdController("books_by_genres"));

module.exports = router;