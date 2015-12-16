var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/pg_scrap_data', function(){
    console.log('mongodb connected')
})
module.exports = mongoose