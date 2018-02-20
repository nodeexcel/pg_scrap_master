var FCM = require('fcm-node');

// added to use secret keys from .env file
require('dotenv').config({path: '../.env'})

module.exports = {
    push_notification: function(token, payload, notify, callback) {
        var serverKey = process.env.FCM_KEY
        var fcm = new FCM(serverKey);
        var message = {
            to: token,
            collapse_key: 'your_collapse_key',
            notification: notify,
            data: payload,
        };
        fcm.send(message, function(err, response) {
            if (err) {
                callback('error', err);
            } else {
                callback('success', response)
            }
        });
    }
};
