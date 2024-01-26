const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

router.route("/")
    .get(getViewByIdController("top_sellers", { "hasParams": false, "isSingleRow": false }));

module.exports = router;