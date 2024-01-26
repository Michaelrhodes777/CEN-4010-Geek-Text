const express = require('express');
const router = express.Router();
const PublisherModel = require('./PublisherModel.js');
const {
    createController,
    readController,
    putController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(PublisherModel))
    .get(readController(PublisherModel))
    .put(putController(PublisherModel))
    .delete(deleteController(PublisherModel));

module.exports = router;