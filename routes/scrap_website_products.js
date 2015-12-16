var express = require('express');
var router = express.Router();

var conn_catalog_urls = require('../models/catalog_urls');
var conn_scrap_data_amazon = require('../models/scrap_data_amazon');
var _ = require('underscore');
var jquery_path = '../public/js/jquery-1.8.3.min.js';
var scraper_amazon = require('../website_scraper/amazon');

function add_update_product( website, new_data ){
    var product_info = new_data;
    var insert_new_product  = new conn_scrap_data_amazon( product_info );
    insert_new_product.save( function(){
        console.log('----new product inserted -----------');
    })
}

conn_catalog_urls.find({},function(err, urls ){
    if( typeof urls == 'undefined' || urls.length == 0 ){
        console.log( 'no urls found');
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
    }
})






module.exports = router;
