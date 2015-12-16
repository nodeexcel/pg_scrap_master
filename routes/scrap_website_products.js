var express = require('express');
var router = express.Router();

var conn_catalog_urls = require('../models/catalog_urls');
var conn_scrap_data_amazon = require('../models/scrap_data_amazon');
var _ = require('underscore');
var jquery_path = '../public/js/jquery-1.8.3.min.js';
var scraper_amazon = require('../website_scraper/amazon');

var pg_generic = require('../modules/generic');


function update_scrap_stat( rec_id, type  ){
    where = {
        "_id" :  rec_id ,
    }
    conn_catalog_urls.findOne( where, function( err, result){
        if( typeof result == 'undefined' || result.length == 0 ){
            
        }else{
            var today_date = new Date().toJSON().slice(0,10); //YYYY-MM-DD eg 2015-12-16
            
            count_insert = 0;
            count_update = 0;
            
            date_wise_stats = result.get( 'date_wise_stats' );
            if( typeof date_wise_stats  == 'undefined' ){
                date_wise_stats = {};
                
            }else{
               _.each( date_wise_stats, function( val, key ){
                   console.log('--- '+key);
                   console.log('--- '+val);
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
            
            if( type == 'insert'){
                count_insert = count_insert + 1;
            }
            if( type == 'update'){
                count_update = count_update + 1;
            }
            
            
            date_wise_stats[ today_date ] = {
                'last_update_time' : 'sdfsdf',
                'insert' : count_insert,
                'update' : count_update
            }
                
                
//            console.log( date_wise_stats );
//            console.log('arun');
//            process.exit(0);

                
                
            
            
            
            
            conn_catalog_urls.update( where,{
                $set: {
                    date_wise_stats : date_wise_stats,
                }
            }, function (err, res){
                if( err ){
                    console.log('update hua hau');
                }else{
                }
                console.log( today_date );
            
            
            console.log( result );
            console.log( rec_id );
            console.log( type );
            
                console.log(date_wise_stats );
            
                //process.exit(0);
            });
            
            
            
            
            ///console.log( today_date );
            
            
            //console.log( result );
            //console.log( rec_id );
            //console.log( type );
           // process.exit(0);
            
        }
    })
}


function add_update_product( u_rec_id, website, website_category, new_data ){
    
    new_data.website = website;
    new_data.website_category = website_category;
    
    var url = new_data.url;
    
    var unique = '';
    if( typeof new_data.unique != 'undefined' && new_data.unique != '' ){
        unique = new_data.unique;
    }else{
        unique = pg_generic.getUniqueCode( website, url );
    }
    new_data.unique = unique;
    
    //console.log('-----');
    //console.log( new_data );
    
    where = {
        website : website,
        unique : unique
    }
    
    
    var product_info = new_data;
    
    //console.log( where );
    
    
    conn_scrap_data_amazon.find( where, function( err, result ){
        if( err ){
            
        }else{
            if( typeof result == 'undefined' || result.length == 0 ){
                var insert_new_product  = new conn_scrap_data_amazon( product_info );
                insert_new_product.save( function(){
                    //console.log('----new product inserted -----------');
                    //process.exit(0);
                    update_scrap_stat( u_rec_id, 'insert');
                    
                })
            }else{
                
                update_scrap_stat( u_rec_id, 'update');
                //console.log('already exists');
                //console.log(result);
                //process.exit(0);
            }
        }
    })
    
    
    
    
    
    
    
    
    
    
    
}

function process_pagination_urls( u_rec_id, website, website_category, urls, count_process, callback ){
    console.log(" START :: process_pagination_urls");
    console.log("---- website : "+ website);
    console.log("---- website_category : "+ website_category);
    //count_process : num of urls to process at a time
    //console.log( urls );
    
    
    console.log( 'pending pagination urls :: ' + urls.length );
    
    
    if( urls.length == 0){
        console.log('all are done');
    }else{
        var page_urls = [];
        
        
        _.each( urls, function( u, key ){
            if( page_urls.length < count_process ){
                page_urls.push( u );
                //delete urls[key];
                urls.splice(key, 1);
            }
        })
        
        
        
        //console.log( urls );
        console.log( page_urls);
        
        
        if( urls.length == 0 ){
            console.log('yahan par hai');
            
            callback('all are done ARUN');
        }
        
        
        //console.log( urls);
        
        if( page_urls.length > 0 ){
            _.each( page_urls, function( u1, key1 ){
                scraper_amazon.get_page_products( u1, function( res_type, res_data ){
                    if( res_type == 'error'){
                                        
                    }else{
                        if( res_data.length > 0 ){
                            _.each( res_data, function( u2 ){
                                add_update_product( u_rec_id, website, website_category, u2 );
                            })
                        }
                        if( urls.length > 0 ){
                            process_pagination_urls( u_rec_id, website, website_category, urls, count_process, callback );
                        }
                    }
                })
            })
        }
        
        console.log('----------------------------------------------------------------------------------------------');
        
        
        
    }
    
    //process.exit(0);
}

function start_scrapping( pending_catalog_urls ){
    // this will process one catalog url at a time and multiple pagination urls if found for the catalog url
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log( "START :: start_scrapping ");
    console.log( "PENDING CATALOG URLS :: "+ pending_catalog_urls.length );
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    
    if( pending_catalog_urls.length == 0 ){
        console.log('all are done');
    }else{
        
        var to_be_scrap = false;
        
        if( typeof pending_catalog_urls[0] != 'undefined' ){
            to_be_scrap = pending_catalog_urls[0];
            
            pending_catalog_urls.splice(0, 1);
            
        }
        
        if( to_be_scrap == false ){
            
        }else{
            //console.log( pending_catalog_urls );
            console.log( to_be_scrap );
            
            var u_url = to_be_scrap.get('url');
            var u_website = to_be_scrap.get('website');
            var u_website_category = to_be_scrap.get('url_text');
            var u_rec_id = to_be_scrap.get('_id');
            
            console.log( 'to_be_scrap u_url : ' + u_url);
            console.log( 'to_be_scrap u_website : ' + u_website);
            console.log( 'to_be_scrap u_website_category : ' + u_website_category);
            console.log( 'u_rec_id : ' + u_rec_id );
            
            
            scraper_amazon.analyse_catalog_url( 0, u_url, u_website_category, jquery_path, function( response_type, response_data ){
                if( response_type == 'error'){
                    console.log('ERROR oCCURS')
                    console.log( response_data);
                    start_scrapping(pending_catalog_urls);
                }else{
                    var new_count_first_page_products = response_data.product_count_on_first_page;
                    var pagination_urls = response_data.pagination_urls;
                    
                    
                    pagination_urls = _.first( pagination_urls , 5 );
                    
                    if( pagination_urls.length > 0 ){
                        
                        process_pagination_urls( u_rec_id, u_website, u_website_category, pagination_urls, 2 , function( data ){
                            console.log( data );
                            console.log('ppppppppppppppppp');
                            
                            start_scrapping(pending_catalog_urls);
                            
                            //process.exit(0);
                        });
                    }else{
                        start_scrapping(pending_catalog_urls);
                    }
                }
            })
            
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
//                scraper_amazon.analyse_catalog_url( key1, u_url, u_website_category, jquery_path, function( response_type, response_data ){
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


w = {
    //'_id' : '5670f8774f59fab6112e1d2c'
}

conn_catalog_urls.find( w,function(err, urls ){
    if( typeof urls == 'undefined' || urls.length == 0 ){
        console.log( 'no urls found');
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
//                scraper_amazon.analyse_catalog_url( key, u_url, '', jquery_path, function( response_type, response_data ){
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






module.exports = router;
