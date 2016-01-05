var express = require('express');
var router = express.Router();

var PARSER = require('../modules/parser');

var conn_catalog_urls = require('../models/catalog_urls');
var conn_website_scrap_data = require('../models/website_scrap_data');
var _ = require('underscore');
var jquery_path = '../public/js/jquery-1.8.3.min.js';
var scraper_amazon = require('../website_scraper/amazon');

var GENERIC = require('../modules/generic');

var date = require('date-and-time');

var CONFIG_scrap_number_of_pagination = 10; // total number og pages to scrap per catalog url, set 0 for all i.e to scrap all pagination pages
var CONFIG_scrap_pages_at_a_time = 1; // number of urls to scrap at a time


function update_scrap_stats( rec_id, type, callback  ){
    where = {
        "_id" :  rec_id ,
    }
    conn_catalog_urls.findOne( where, function( err, result){
        if( typeof result == 'undefined' || result.length == 0 ){
        }else{
            var today_date = PARSER.currentDate();
            
            count_insert = 0;
            count_update = 0;
            date_wise_stats = result.get( 'date_wise_stats' );
            if( typeof date_wise_stats  == 'undefined' ){
                date_wise_stats = {};
            }else{
               _.each( date_wise_stats, function( val, key ){
                   if( key == today_date ){
                       if( typeof val.insert != 'undefined'){
                           count_insert = val.insert;
                       }
                       if( typeof val.update != 'undefined'){
                           count_update = val.update;
                       }
                   }
               })
            }
            var to_be_update_data = {
                last_update_time : PARSER.currentTimestamp(),
                last_update_time_dt : PARSER.currentDateTimeDay(),
            }
            if( type == 'insert'){
                count_insert = count_insert + 1;
            }
            if( type == 'update'){
                count_update = count_update + 1;
            }
            date_wise_stats[ today_date ] = {
                'insert' : count_insert,
                'update' : count_update
            }
            if( type == 'scrap_start' ){
                to_be_update_data['scrap_status']  = 1;
                date_wise_stats[ today_date ] = {
                    'insert' : 0,
                    'update' : 0
                }
            }
            to_be_update_data['date_wise_stats']  = date_wise_stats;
            
            conn_catalog_urls.update( where,{
                $set: to_be_update_data
            }, function (err, res){
                if( err ){
                    callback('error');
                }else{
                    callback('success');
                }
            });
        }
    })
}


function add_update_product( u_rec_id, website, website_category, new_data, callback ){
    
    new_data.website = website;
    new_data.website_category = website_category;
    
    var url = new_data.url;
    
    var unique = '';
    if( typeof new_data.unique != 'undefined' && new_data.unique != '' ){
        unique = new_data.unique;
    }else{
        unique = GENERIC.getUniqueCode( website, url );
    }
    new_data.unique = unique;
    
    
    new_data.date_of_birth = PARSER.currentIsoDate();
    new_data.time = PARSER.currentTimestamp();
    new_data.time_pretty = PARSER.currentIsoDate();
    
    new_data.date = PARSER.currentDate();
    
    
    new_data.scrap_source = 'pg_scrap_master';
    
    if( typeof new_data.price != 'undefined' && new_data.price != '' ){
        new_data.price = new_data.price * 1;
    }
    
    
    //console.log('-----');
    //console.log( new_data );
    //process.exit(0);
    
    where = {
        website : website,
        unique : unique
    }
    
    
    var product_info = new_data;
    
    //console.log( where );
    
    
    conn_website_scrap_data.find( where, function( err, result ){
        if( err ){
            callback('Error Occurs');
        }else{
            if( typeof result == 'undefined' || result.length == 0 ){
                var insert_new_product  = new conn_website_scrap_data( product_info );
                insert_new_product.save( function(){
                    update_scrap_stats( u_rec_id, 'insert', function( aa ){
                        console.log('1 INSERT :: '+aa);
                        callback('Products Inserted');
                    });
                })
            }else{
                exist_product = result[0];
                var exist_date = exist_product.get('date');
                var price_history = exist_product.get('price_history');
                if (typeof price_history == 'undefined' || !price_history || price_history == null) {
                    price_history = [];
                }
                //if( exist_date == 'undefined' || (exist_date == PARSER.currentDate ) ){
                if( exist_date == 'undefined' || ( exist_date.toString() != PARSER.currentDate().toString()  ) ){
                    if( new_data.price != '' && new_data.price > 0){ 
                        price_history.push({
                            date: PARSER.currentDate(),
                            timestamp: PARSER.currentTimestamp(),
                            price: new_data.price*1
                        });
                        if (price_history.length > 30) {
                            price_history.shift();
                        }
                    }
                }
                to_be_update_data = {
                    date_of_birth : PARSER.currentIsoDate(),
                    price : new_data.price,
                    price_history: price_history,
                    updated: 1,
                    time: PARSER.currentTimestamp(),
                    time_pretty: PARSER.currentIsoDate(),
                    date: PARSER.currentDate(),
                };
                conn_website_scrap_data.update(where,{'$set' : to_be_update_data}, function (err, res) {
                    if( err ){
                        callback('Products Updated');
                    }else{
                        update_scrap_stats( u_rec_id, 'update', function( aa ){
                            console.log('1 UPdated :: '+aa);
                            callback('Products Updated');
                        });
                    }
                });
            }
        }
    })
    
    
    
    
    
    
    
    
    
    
    
}

function insert_or_update_products( u_rec_id, website, website_category, scraped_products, callback ){
    console.log( "---------------------------------------------------------------------Products Remaining For Insert & Update  :: " + scraped_products.length );
    if( scraped_products.length ==  0 ){
        callback('0 Scrapped Products Remaining Hence Callback Called');
    }else{
        product = scraped_products[0];
        scraped_products.splice(0, 1); //remove first product
        add_update_product( u_rec_id, website, website_category, product, function(){
            insert_or_update_products( u_rec_id, website, website_category, scraped_products, callback );
        })
    }
}


function process_pagination_urls( u_rec_id, website, website_category, urls, count_process, callback ){
    console.log( "-------------------------------------------------------------------------------------------------------------------------------");
    console.log( "---------------------------------------------------------------------STEP :: Start Processing Pagination Urls ");
    console.log( "---------------------------------------------------------------------website ::  " + website);
    console.log( "---------------------------------------------------------------------website_category ::  " + website_category);
    console.log( "---------------------------------------------------------------------Pending Pagination Urls :: " + urls.length );
    
    console.log( "---------------------------------------------------------------------At A Time Pagination Urls Process Count:: " + count_process );
    console.log(urls);
    
    if( urls.length == 0){
        callback('0  pagination urls remains hence callback called');
    }else{
        var page_urls = [];
        _.each( urls, function( u, key ){
            if( page_urls.length < count_process ){
                page_urls.push( u );
                urls.splice(key, 1);
            }
        })
        if( page_urls.length > 0 ){
            console.log( "-------------------------------------------------------------------------------------------------------------------------------");
            _.each( page_urls, function( u1, key1 ){
                console.log('SCRAPING  URL :: ' +  u1 );
                console.log( "-------------------------------------------------------------------------------------------------------------------------------");
                scraper_amazon.get_page_products( u1, function( res_type, res_data ){
                    console.log( "---------------------------------------------------------------------Scraping Status : " + res_type );
                    if( res_type == 'error'){
                        console.log( "---------------------------------------------------------------------As Error Occurs Calling Recursivley");
                        process_pagination_urls( u_rec_id, website, website_category, urls, count_process, callback );
                    }else{
                        console.log( "---------------------------------------------------------------------Count products scraped :: " + res_data.length );
                        if( res_data.length > 0 ){
                            console.log( "---------------------------------------------------------------------Going to Insert Or Update Scraped Products");
                            insert_or_update_products( u_rec_id, website, website_category, res_data, function(){
                                process_pagination_urls( u_rec_id, website, website_category, urls, count_process, callback );
                            });
                            ///i am stucked here 
//                            _.each( res_data, function( u2 ){
//                                add_update_product( u_rec_id, website, website_category, u2, function(){
//                                    
//                                });
//                            })
                        }else{
                            process_pagination_urls( u_rec_id, website, website_category, urls, count_process, callback );
                        }
                    }
                })
            })
        }
    }
}

function start_scrapping( pending_catalog_urls ){
    // this will process one catalog url at a time and multiple pagination urls if found for the catalog url
    console.log('#######################################################################################################');
    console.log('#######################################################################################################');
    
    console.log( "---------------------------------------------------------------------START :: start_scrapping ");
    console.log( "-------------------------------------------------------------------------------------------------------------------------------------------------------------------PENDING CATALOG URLS :: "+ pending_catalog_urls.length );
    if( pending_catalog_urls.length == 0 ){
        console.log('*************************************************************************');
        console.log('ALL URLS ARE PROCESSED ------ Going to start scrapping again ');
        console.log('*************************************************************************');
        initiateScrapping();
        //process.exit(0);
    }else{
        var to_be_scrap = false;
        if( typeof pending_catalog_urls[0] != 'undefined' ){
            to_be_scrap = pending_catalog_urls[0];
            pending_catalog_urls.splice(0, 1); // remove the url from pending_catalog_urls list
        }
        if( to_be_scrap == false ){
        }else{
            console.log( "---------------------------------------------------------------------Pending url going to process is below ");
            var u_url = to_be_scrap.get('url');
            var u_website = to_be_scrap.get('website');
            var u_website_category = to_be_scrap.get('url_text');
            var u_rec_id = to_be_scrap.get('_id');
            update_scrap_stats( u_rec_id, 'scrap_start', function( aa ){
                console.log( 'to_be_scrap u_url : ' + u_url);
                console.log( 'to_be_scrap u_website : ' + u_website);
                console.log( 'to_be_scrap u_website_category : ' + u_website_category);
                console.log( 'u_rec_id : ' + u_rec_id );
                console.log( "-------------------------------------------------------------------------------------------------------------------------------");
                console.log( "---------------------------------------------------------------------STEP :: Analysing Catalog Url Response");
                scraper_amazon.analyse_catalog_url( 1, u_url, u_website_category, jquery_path, function( response_type, response_data ){
                    //console.log( response_data );
                    if( response_type == 'error'){
                        console.log( "---------------------------------------------------------------------ERROR OCCURS");
                        start_scrapping(pending_catalog_urls);
                    }else{
                        console.log( "---------------------------------------------------------------------SUCCESS OCCURS");
                        pagination_urls = response_data.pagination_urls;
                        console.log( "---------------------------------------------------------------------Pagination Urls Found :: " + pagination_urls.length );
                        if( CONFIG_scrap_number_of_pagination != 0 ){
                            pagination_urls = _.first( pagination_urls , CONFIG_scrap_number_of_pagination ); // number of pagination pages to scrap products
                        }
                        console.log( "---------------------------------------------------------------------Pagination Urls Will Be Processed :: " + pagination_urls.length );
                        if( pagination_urls.length > 0 ){
                            process_pagination_urls( u_rec_id, u_website, u_website_category, pagination_urls, CONFIG_scrap_pages_at_a_time , function( data ){
                                console.log( data );
                                //console.log('>>>>');
                                //process.exit(0);
                                start_scrapping(pending_catalog_urls);
                            });
                        }else{
                            start_scrapping(pending_catalog_urls);
                        }
                    }
                })
            });
            
        }
        
        
        
//        
//        var page_urls =[];
//        
//        _.each( catalog_urls, function( u, key ){
//            if( page_urls.length < count_process ){
//                page_urls.push( u );
//                urls.splice(key, 1);
//            }
//        })
//        
//        
//        console.log( catalog_urls );
//        console.log( page_urls);
//        
//        
//        
//        _.each( urls, function( u, key ){
//            if( key >= start_key ){
//                if( page_urls.length < count_process ){
//                    page_urls.push( u );
//                }
//            }
//        })
//        
//        console.log( page_urls );
//        
//        if( page_urls.length > 0 ){
//            _.each( page_urls, function( u1, key1 ){
//                console.log( key1 );
//                console.log( u1 );
//                var u_url = u1.get('url');
//                var u_website = u1.get('website');
//                var u_website_category = u1.get('url_text');
//                
//                console.log( 'u_url : ' + u_url);
//                console.log( 'u_website : ' + u_website);
//                console.log( 'u_website_category : ' + u_website_category);
//                
//                scraper_amazon.analyse_catalog_url(  u_url, u_website_category, jquery_path, function( response_type, response_data ){
//                    if( response_type == 'error'){
//                        console.log('ERROR oCCURS')
//                        console.log( response_data);
//                    }else{
//                        var new_count_first_page_products = response_data.product_count_on_first_page;
//                        var pagination_urls = response_data.pagination_urls;
//                        if( pagination_urls.length > 0 ){
//                            process_pagination_urls( u_website, u_website_category, pagination_urls, 3 );
//                        }
//                    }
//                })
//                
//            })
//        }
    }
    
}



//----SCRIPT STARTING POINT--------------------------------------------


function initiateScrapping(){
//    w = {
//        '_id' : '56837db661baea5d13dbf9f5'
//    }
    w = {
            '$or' : [
                {   'scrap_status' : 0 },
                {   'scrap_status' : { '$exists' :  false } },
            ]
    }
    
    conn_catalog_urls.find( w,function(err, urls ){
    if( typeof urls == 'undefined' || urls.length == 0 ){
        console.log( 'no urls found------ reseting all urls');
        conn_catalog_urls.update( {},{
            $set: { 'scrap_status' : 0 }
        }, {
            multi: true 
        },function (err, res){
            if( err ){
            }else{
                initiateScrapping();
                console.log('update hua hau');
            }
        });
    }else{
        //urls = _.first( urls , 5);        
        start_scrapping( urls );
        
        
//        
//        _.each( urls, function( u, key){
//            (function ( key, u ){
//                var total_product_scrapped = 0;
//                console.log( key );
//                console.log( u );
//                var u_url = u.get('url');
//                var u_website = u.get('website');
//                var u_website_category = u.get('url_text');
//                
//                //u_url = "http://www.amazon.in/Sports-Outdoor-Women-Shoes/b/ref=sd_allcat_shoes_wsports/279-9346044-4254939?ie=UTF8&node=1983579031";
//                console.log( u_url );
//                console.log( u_url );
//                scraper_amazon.analyse_catalog_url(  u_url, '', jquery_path, function( response_type, response_data ){
//                    if( response_type == 'error'){
//                        console.log('ERROR oCCURS')
//                        console.log( response_data);
//                    }else{
//                        //console.log( response_data );
//                        var new_count_first_page_products = response_data.product_count_on_first_page;
//                        var pagination_urls = response_data.pagination_urls;
//                        if( pagination_urls.length > 0 ){
//                            process_pagination_urls( u_website, u_website_category, pagination_urls, 1, 0);
//                            //pagination_urls = _.first( pagination_urls , 1);
////                            _.each( pagination_urls, function( u1, key1 ){
////                                console.log( key );
////                                console.log('----------'+key);
////                                console.log('----------'+u1);
////                                scraper_amazon.get_page_products( u1, function( res_type, res_data ){
////                                    if( res_type == 'error'){
////                                        
////                                    }else{
////                                        if( res_data.length > 0 ){
////                                            _.each( res_data, function( u2 ){
////                                                add_update_product( u_website, u_website_category, u2 );
////                                            })
////                                            //console.log( res_data );
////                                            total_product_scrapped = total_product_scrapped + res_data.length;
////                                        }
////                                        console.log('total_product_scrapped :: '+ key +' :: ' + total_product_scrapped);
////                                    }
////                                })
////                            })
//                        }
//                    }
//                })
//            })( key, u );
//        })
    }
})
    
    

}



initiateScrapping();





module.exports = router;
