const express = require('express');
const router = express.Router();
const getViewByIdController = require('../getViewByIdController.js');

function calculateTotal(results) {
    let sum = 0;
    for (let dataObject of results.shopping_cart) {
        let subTotal = dataObject.quantity * dataObject.book_data.book_price;
        dataObject.sub_total = subTotal;
        sum += subTotal;
    }
    results.total = sum;
}

router.route("/:user_id")
    .get(getViewByIdController(
        "shopping_carts",
        {
            "hasParams": true,
            "isSingleRow": true,
            "postPros": calculateTotal 
        }
    ));

module.exports = router;