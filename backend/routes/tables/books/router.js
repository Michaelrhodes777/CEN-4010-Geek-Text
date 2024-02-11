const express = require('express');
const router = express.Router();
const BookModel = require('./BookModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(BookModel))
    .get(readController(BookModel))
    .put(updateController(BookModel))
    .delete(deleteController(BookModel));

module.exports = router;