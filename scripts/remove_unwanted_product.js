var mongoose = require('mongoose')
var _ = require('lodash');
var conn_pg_scrap_db2 = mongoose.createConnection('mongodb://127.0.0.1/scrap_db2');
var schema_db2_website_scrap_data = mongoose.Schema({}, {
    strict: false,
    collection: 'website_scrap_data'
});
var pg_scrap_db2_website_scrap_data = conn_pg_scrap_db2.model('website_scrap_data', schema_db2_website_scrap_data);
var moment = require('moment');

function unwantedProduct(days, no_of_times) {
    var myNegInt = Math.abs(days) * (-1);
    var last_date = moment().add(myNegInt, 'days').unix();
    if (days && no_of_times) {
        pg_scrap_db2_website_scrap_data.remove({$where: "this.price_log && this.price_log.length >= " + no_of_times + "", "price_history.timestamp": {$lte: last_date}}, function (err, products) {
            if (err) {
                console.log(err)
            } else {
                if (products.result.ok == 1) {
                    console.log('Total no of products removed is ' + products.result.n)
                }
            }
        });
    } else {
        console.log('days and no_of_times cannot be empty')
    }
}
unwantedProduct(3, 3);