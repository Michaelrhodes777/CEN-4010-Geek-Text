const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

router.route("/:isbn")
    .get(getViewByIdController("books"));

module.exports = router;