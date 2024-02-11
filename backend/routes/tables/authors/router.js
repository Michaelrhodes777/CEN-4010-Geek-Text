const express = require('express');
const router = express.Router();
const AuthorModel = require('./AuthorModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(AuthorModel))
    .get(readController(AuthorModel))
    .put(updateController(AuthorModel))
    .delete(deleteController(AuthorModel));

module.exports = router;