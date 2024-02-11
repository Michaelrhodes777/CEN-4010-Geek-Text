const express = require('express');
const router = express.Router();
const UserModel = require('./UserModel.js');
const {
    createController,
    readController,
    updateController,
    deleteController
} = require('../controllers.js');

router.route("/")
    .post(createController(UserModel))
    .get(readController(UserModel))
    .put(updateController(UserModel))
    .delete(deleteController(UserModel));

module.exports = router;