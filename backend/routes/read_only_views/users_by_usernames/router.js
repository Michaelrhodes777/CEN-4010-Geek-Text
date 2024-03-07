const express = require('express');
const router = express.Router();
const { readController } = require('./controllers.js');

router.route("")
    .get(readController);

module.exports = router;