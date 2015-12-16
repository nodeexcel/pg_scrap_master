var express = require('express');
var router = express.Router();

require('events').EventEmitter.prototype._maxListeners = 100;



var conn_catalog_urls = require('../models/catalog_urls');
var conn_scrap_data_amazon = require('../models/scrap_data_amazon');

var _ = require('underscore');

var jquery_path = '../public/js/jquery-1.8.3.min.js';

var scraper_amazon = require('../website_scraper/amazon');

var parser_aa = require('../modules/parser')


var amazon_category_list_url = "http://www.amazon.in/gp/site-directory/ref=nav_shopall_btn";


function add_new_catalog_url( website, new_data ){
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^NEW CATALOG URL^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    var new_catalog_url = {
        website : website,
        url : new_data.url,
        count_first_page_products : new_data.count_first_page_products,
        count_total_pages : new_data.count_total_pages,
    }
    
    var insert_new_catalog_url  = new conn_catalog_urls( new_catalog_url );
    insert_new_catalog_url.save( function(){
        console.log( new_catalog_url );
        console.log('----new catalog url inserted -----------');
    })
}
function add_update_product( website, new_data ){
    var product_info = new_data;
    var insert_new_product  = new conn_scrap_data_amazon( product_info );
    insert_new_product.save( function(){
        //console.log( new_catalog_url );
        console.log('----new product inserted -----------');
    })
}

function process_catalog_urls( data, start_key, jquery_path, check_n_pages ){
    
    console.log('*******************************************************************************************************************');
    console.log('*************************************'+start_key+'****************************************************************************');
    console.log('*******************************************************************************************************************');
    
    console.log( 'array length :: ' + data.length );
    console.log( 'going to start :: ' + start_key );


    if( start_key > data.length){
        console.log('all are done');
        return "ARUN KUMAR ALL ARE DONE";
    }else{
        //console.log( data );
        var u = data[start_key];

        console.log( 'start_key :: '+ start_key);
        console.log( 'start_url :: '+ u);

        scraper_amazon.analyse_catalog_url( start_key, u, jquery_path, check_n_pages, function( response_type, response_data ){
            if( response_type == 'error'){
                console.log('ERROR oCCURS')
                console.log( response_data);
                start_key = start_key + 1;
                process_catalog_urls( data, start_key, jquery_path, check_n_pages )
            }else{
                var new_count_first_page_products = response_data.product_count_on_first_page;
                if( new_count_first_page_products > 0 ){
                    valid_catalog_url_count++;
                    console.log( "valid_catalog_url_count :: " + valid_catalog_url_count );
                    
                    var new_website = 'amazon';
                    var new_data = {
                        url : response_data.url,
                        count_first_page_products : new_count_first_page_products,
                        count_total_pages : response_data.total_pages,
                    };
                    add_new_catalog_url( new_website, new_data );
                }
                console.log( response_data );

                //}
                start_key = start_key + 1;
                process_catalog_urls( data, start_key, jquery_path, check_n_pages )

            }       
        }) 
    }
}







router.get('/add_new_catalog_urls', function(req, res, next) {
    
    var valid_catalog_url_count = 0;

    scraper_amazon.get_catalog_urls( amazon_category_list_url, jquery_path,  function( response_type, response_data ){
    if( response_type  == 'error'){
        console.log('Error in getting catalog urls');
    }else{
        data = response_data.urls
        console.log('Catalog URLsf Found count :: '+ data.length );
        
        if( data.length > 0 ){
            //data = _.first( data , 50);
            //console.log( data );
            var check_n_pages = 1;
    //        _.each( data, function( u, key){
    //            console.log( key +' ::: '+ u);
    //            scraper_amazon.analyse_catalog_url( key, u, jquery_path, check_n_pages, function( response_type, response_data ){
    //                //console.log( response_type );
    //                if( response_type == 'error'){
    //                    
    //                }else{
    //                    if( response_data.product_count_on_first_page > 0 ){
    //                        valid_catalog_url_count++;
    //                        console.log( response_data );
    //                        
    //                        console.log( "valid_catalog_url_count :: " + valid_catalog_url_count );
    //                        
    //                    }
    //                    
    //                }
    //                //console.log('err1 aaya hai');
    //                //console.log(err1);
    //            })
    //        })
            var dd = process_catalog_urls( data, 0, jquery_path, check_n_pages );
    //
    //        console.log(dd);
    //
    //
    //
    //        // _.each( data, function( u, key  ){
    //        //     console.log('KEY :: '+ key);
    //        //      scraper_amazon.analyse_catalog_url( u, jquery_path, check_n_pages, function( err1 ){
    //                
    //        //      },function( data1 ){
    //        //          console.log( data1 );
    //        //          console.log('***************************************');
    //        //      }) 
    //        // })
        }
        //console.log( data );
    }
});

    res.json( {valid_catalog_url_count : valid_catalog_url_count });
  
});

router.get('/scrap_website', function(req, res, next) {
    
    conn_catalog_urls.find({},function(err, urls ){
    if( typeof urls == 'undefined' || urls.length == 0 ){
        console.log( 'no urls found');
        res.json({no_data_found:no_data_found});
    }else{
        urls = _.first( urls , 1);
        _.each( urls, function( u, key){
            (function ( key, u ){
                var total_product_scrapped = 0;
                console.log( key );
                console.log( u );

                var u_url = u.get('url');

                u_url = "http://www.amazon.in/Sports-Outdoor-Women-Shoes/b/ref=sd_allcat_shoes_wsports/279-9346044-4254939?ie=UTF8&node=1983579031";
                console.log( u_url );
                console.log( u_url );


                scraper_amazon.analyse_catalog_url( key, u_url, jquery_path, function( response_type, response_data ){
                    if( response_type == 'error'){
                        console.log('ERROR oCCURS')
                        console.log( response_data);
                    }else{
                        //console.log( response_data );
                        var new_count_first_page_products = response_data.product_count_on_first_page;
                        var pagination_urls = response_data.pagination_urls;
                        if( pagination_urls.length > 0 ){
                            //pagination_urls = _.first( pagination_urls , 1);
                            _.each( pagination_urls, function( u1, key1 ){
                                console.log( key );
                                console.log('----------'+key);
                                console.log('----------'+u1);
                                scraper_amazon.get_page_products( u1, function( res_type, res_data ){
                                    if( res_type == 'error'){
                                        
                                    }else{
                                        if( res_data.length > 0 ){
                                            _.each( res_data, function( u2 ){
                                                add_update_product( 'website' , u2 );
                                            })
                                            //console.log( res_data );
                                            total_product_scrapped = total_product_scrapped + res_data.length;
                                        }
                                        
                                        
                                        console.log('total_product_scrapped :: '+ key +' :: ' + total_product_scrapped);
                                        
                                    }
                                })
                            })
                        }
                        
                    }
                })
            })( key, u );
        })

        //console.log( urls );

        //res.json({true:true});
    }
})
    
});




module.exports = router;
