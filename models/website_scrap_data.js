var db = require('../database.js')
var model_schema_website_scrap_data = db.Schema({}, {
    strict: false,
    collection: 'website_scrap_data'
});
module.exports = db.model('website_scrap_data', model_schema_website_scrap_data)