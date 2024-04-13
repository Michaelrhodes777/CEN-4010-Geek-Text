const express = require('express');
const router = express.Router();
const getViewByIdController = require('./controller.js');

router.route("/:book_id_fkey")
    .get(getViewByIdController("comments_view"));

module.exports = router;