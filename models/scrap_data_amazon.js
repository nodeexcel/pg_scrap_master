var db = require('../database.js')

var model_schema_scrap_data_amazon = db.Schema({}, {
    strict: false,
    collection: 'scrap_data_amazon'
});

module.exports = db.model('scrap_data_amazon', model_schema_scrap_data_amazon)