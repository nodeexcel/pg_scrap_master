var conn_catalog_urls = require('../models/catalog_urls');

var date = require('date-and-time');


var stat_dates = [];
var now = new Date();
today_date = date.format( now, 'YYYY-MM-DD' );
for( var i = 10; i >=1; i-- ){
    d = date.addDays(now, -i);
    d = date.format( d, 'YYYY-MM-DD' );
    stat_dates.push( d );
}
stat_dates.push( today_date );
exports.getStats = function(req, res) {
    
    
    conn_catalog_urls.find({}).sort({ last_update_time : -1, scrap_status : -1}).exec(function(err,data){
    
    //conn_catalog_urls.find( function(err, data ) {
        var stats = [];
        if( err ){
            
        }else{
            var stats_pending = 0;
            var stats_done = 0;
            
            if( data.length > 0 ){
                for( var k in data ){
                    row = JSON.stringify( data[k] );
                    row = JSON.parse( row );
                    
                    scrap_status = row.scrap_status;
                    
                    if( typeof scrap_status == 'undefined' || scrap_status == 0 ){
                        stats_pending += 1;
                    }else{
                        stats_done +=  1;
                    }
                    
                    
                    var new_date_wise_stats = {};
                   
                    date_wise_stats = row.date_wise_stats;
                    
                    
                    
                    
                    if( typeof date_wise_stats != 'undefined' ){
                        for( var k in stat_dates ){
                            var found = false;
                            k_date = stat_dates[k]
                            for( var k1 in date_wise_stats ){
                                if( k1 == k_date ){
                                    found = true;
                                    new_date_wise_stats[k_date]= date_wise_stats[k_date] ;
                                }
                            }
                            if( found == false ){
                                new_date_wise_stats[k_date] =  {} ;
                            }
                        }
                    }
                    
                    //console.log( today_date );
                    //console.log( date_wise_stats );
                    
                    //new_date_wise_stats = JSON.stringify( new_date_wise_stats );
                    //new_date_wise_stats = JSON.parse( new_date_wise_stats );
                    
                    
                    row['date_wise_stats'] = new_date_wise_stats;
                    
                    
                    //console.log('*************************************');
                    //console.log( new_date_wise_stats );
                    //console.log('*************************************');
                    //process.exit(0);
                    
                    stats.push( row );
                }
            }
        }
        res.render('stats',{
            stat_dates : stat_dates,
            data : stats,
            stats_pending : stats_pending,
            stats_done : stats_done
        });
    });
};

