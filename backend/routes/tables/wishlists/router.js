const express = require('express');
const router = express.Router();
const WishlistModel = require('./WishlistModel.js');
const {
    createController,
    readController,
    putController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(WishlistModel))
    .get(readController(WishlistModel))
    .put(putController(WishlistModel))
    .delete(deleteController(WishlistModel));

module.exports = router;