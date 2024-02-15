const express = require('express');
const router = express.Router();
const CreditCardModel = require('./CreditCardModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(CreditCardModel))
    .get(readController(CreditCardModel))
    .put(updateController(CreditCardModel))
    .delete(deleteController(CreditCardModel));

module.exports = router;