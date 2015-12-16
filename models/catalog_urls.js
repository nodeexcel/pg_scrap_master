var db = require('../database.js')

var model_schema_catalog_urls = db.Schema({}, {
    strict: false,
    collection: 'catalog_urls'
});

module.exports = db.model('catalog_urls', model_schema_catalog_urls)