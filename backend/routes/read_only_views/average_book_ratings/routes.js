const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');
const { getByMinRating } = require('./controllers.js');

router.route("/by_book_id/:book_id")
    .get(getViewByIdController("average_book_ratings"));
router.route("/by_average_rating/:average_rating")
    .get(getByMinRating);

module.exports = router;