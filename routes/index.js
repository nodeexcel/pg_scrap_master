var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var screenshot = require('screenshot-node');

var statsController = require('../controllers/stats');
router.get('/stats', statsController.getStats);

var args = process.argv.slice(2);

cmd.get(args[0], function (data, err, stderr) {
    if (!err) {
        screenshot.saveScreenshot(0, 0, 1060, 760, "image.png", function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('screenshot saved');
            }
        })
    } else {
        console.log('error', err)
    }
});

module.exports = router;