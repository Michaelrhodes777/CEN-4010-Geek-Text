const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

function fixList(results) {
    delete results.user_id;
    let build = [];
    for (let dataObject of results.shopping_cart) {
        build.push(JSON.parse(JSON.stringify(dataObject.book_data)));
    }
    delete results.shopping_cart;
    results.books = build;
}

router.route("/:user_id")
    .get(getViewByIdController(
        "shopping_carts",
        {
            "hasParams": true,
            "isSingleRow": true,
            "postPros": fixList
        }
    ));

module.exports = router;