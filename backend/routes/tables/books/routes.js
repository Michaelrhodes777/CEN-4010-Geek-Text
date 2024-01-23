const express = require('express');
const router = express.Router();
const BookModel = require('./BookModel.js');
const {
    createController,
    readController,
    putController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(BookModel))
    .get(readController(BookModel))
    .put(putController(BookModel))
    .delete(deleteController(BookModel));

module.exports = router;