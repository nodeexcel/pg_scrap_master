var mongoose = require('mongoose')
//mongoose.connect('mongodb://localhost/pg_scrap_data', function(){
//    console.log('mongodb connected')
//})
//module.exports = mongoose

var conn_pg_scrap_db1 = mongoose.createConnection('mongodb://127.0.0.1/scrap_db1');
var conn_pg_scrap_db2 = mongoose.createConnection('mongodb://127.0.0.1/scrap_db2');
var conn_fiq_scrap_db3 = mongoose.createConnection('mongodb://144.76.83.246/scrap_db3');


var schema_db1_website_scrap_data = mongoose.Schema({}, {
    strict: false,
    collection: 'website_scrap_data'
});
var schema_db2_website_scrap_data = mongoose.Schema({}, {
    strict: false,
    collection: 'website_scrap_data'
});
var schema_db3_website_scrap_data = mongoose.Schema({}, {
    strict: false,
    collection: 'website_scrap_data'
});

var pg_scrap_db1_website_scrap_data = conn_pg_scrap_db1.model('website_scrap_data', schema_db1_website_scrap_data);
var pg_scrap_db2_website_scrap_data = conn_pg_scrap_db2.model('website_scrap_data', schema_db2_website_scrap_data);
var fiq_scrap_db3_website_scrap_data = conn_fiq_scrap_db3.model('website_scrap_data', schema_db3_website_scrap_data);