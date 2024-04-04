const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

router.route("/by_author_id/:author_id")
    .get(getViewByIdController("books_by_authors"));

module.exports = router;