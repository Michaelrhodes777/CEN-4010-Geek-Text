const express = require('express');
const router = express.Router();
const GenreModel = require('./GenreModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(GenreModel))
    .get(readController(GenreModel))
    .put(updateController(GenreModel))
    .delete(deleteController(GenreModel));

module.exports = router;