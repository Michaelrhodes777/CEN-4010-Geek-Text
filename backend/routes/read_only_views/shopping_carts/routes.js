const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

router.route("/:user_id")
    .get(getViewByIdController("shopping_carts"));

module.exports = router;