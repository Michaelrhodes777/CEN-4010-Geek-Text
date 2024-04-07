const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

function subtotal(results) {
    delete results.user_id;
    let build = [];
    let total = 0;
    for (let dataObject of results.shopping_cart) {
        let subTotal = dataObject.quantity * dataObject.book_data.book_price;
        total += subTotal;
        build.push({
            sub_total: subTotal,
            book_id: dataObject.book_data.book_id
        });
    }
    build.total = total;
    delete results.shopping_cart;
    results.subtotal = build;
    results.total = total;
}

router.route("/:user_id")
    .get(getViewByIdController(
        "shopping_carts",
        {
            "hasParams": true,
            "isSingleRow": true,
            "postPros": subtotal 
        }
    ));

module.exports = router;