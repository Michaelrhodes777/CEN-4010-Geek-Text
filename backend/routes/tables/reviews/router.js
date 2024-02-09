const express = require('express');
const router = express.Router();
const ReviewModel = require('./ReviewModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(ReviewModel))
    .get(readController(ReviewModel))
    .put(updateController(ReviewModel))
    .delete(deleteController(ReviewModel));

module.exports = router;