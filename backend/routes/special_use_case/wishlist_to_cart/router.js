const express = require('express');
const router = express.Router();
const { updateController } = require('./controllers.js');

router.route("")
    .put(updateController);

module.exports = router;