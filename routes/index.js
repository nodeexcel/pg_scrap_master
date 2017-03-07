var express = require('express');
var router = express.Router();

var statsController = require('../controllers/stats');


router.get( '/stats', statsController.getStats );



module.exports = router;