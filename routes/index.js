var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
// var screenshot = require('screenshot-node');

var statsController = require('../controllers/stats');
router.get('/stats', statsController.getStats);

module.exports = router;
