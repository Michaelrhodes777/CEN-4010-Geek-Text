const express = require('express');
const router = express.Router();
const PublisherModel = require('./PublisherModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(PublisherModel))
    .get(readController(PublisherModel))
    .put(updateController(PublisherModel))
    .delete(deleteController(PublisherModel));

module.exports = router;