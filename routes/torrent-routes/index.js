const express = require('express');
const router = express.Router();



router.use('/1337x',  require('./1337x'))
router.use('/piratebay', require('./thePiratebay'))
router.use('/rarbg', require('./rarbg'))

module.exports = router;