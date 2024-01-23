const express = require('express');
const router = express.Router();
const AuthorModel = require('./AuthorModel.js');
const {
    createController,
    readController,
    putController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(AuthorModel))
    .get(readController(AuthorModel))
    .put(putController(AuthorModel))
    .delete(deleteController(AuthorModel));

module.exports = router;