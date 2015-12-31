var express = require('express');
var router = express.Router();

var conn_catalog_urls = require('../models/catalog_urls');
var conn_scrap_data_amazon = require('../models/scrap_data_amazon');
var _ = require('underscore');
var jquery_path = '../public/js/jquery-1.8.3.min.js';
var scraper_amazon = require('../website_scraper/amazon');

var valid_catalog_url_count = 0;

var amazon_category_list_url = "http://www.amazon.in/gp/site-directory/ref=nav_shopall_btn";



function add_new_catalog_url( website, new_data, callback ){
    console.log( "---------------------------------------------------------------------New Catalog Url Will Be Insert" );
    var new_url = new_data.url;
    new_url = new_url.trim();
    
    var new_url_text = new_data.url_text;
    new_url_text = new_url_text.trim();
    
    if( typeof new_url_text == 'undefined' || new_url_text == '' ){        
        callback('some error occurs');
    }else{
        new_url_text = new_url_text.toLowerCase();
        where = {
            website : website,
            url_text : new_url_text
        }
        conn_catalog_urls.find( where, function( err, result ){
            if( err ){
                callback('error occurs');
            }else{
                if( typeof result != 'undefined' && result.length > 0 ){
                    callback('CATALOG URL ALREADY EXISTS');
                }else{
                    var new_catalog_url = {
                        website : website,
                        url : new_url,
                        url_text : new_url_text,
                        count_first_page_products : new_data.count_first_page_products,
                        count_total_pages : new_data.count_total_pages,
                    }
                    var insert_new_catalog_url  = new conn_catalog_urls( new_catalog_url );
                    insert_new_catalog_url.save( function(){
                        callback('CATALOG URL INSERTED');
                    })
                }
            }
        })
    }
}


function verify_valid_catalog_urls( data,  jquery_path, callback ){
    console.log( "---------------------------------------------------------------------Total Urls Pending To Check  :: " + data.length );
    if( data.length == 0 ){
        callback('0 Urls left to check hence callback is called');
    }else{
        url_data = data[0];
        data.splice(0, 1); //remove first item
        
        var url = url_data.url;
        var url_text = url_data.text;
        console.log( "---------------------------------------------------------------------Checking Url :: " + url );
        console.log( "---------------------------------------------------------------------Checking Url Text :: " + url_text );
        
        scraper_amazon.analyse_catalog_url( url, url_text,  jquery_path, function( response_type, response_data ){
            console.log( "---------------------------------------------------------------------Checking Response :: " + response_type );
            if( response_type == 'error'){
                verify_valid_catalog_urls( data, jquery_path, callback )
            }else{
                var new_count_first_page_products = response_data.product_count_on_first_page;
                console.log( "--------------------------------------- Products Found On First Page :: " + new_count_first_page_products );
                if( new_count_first_page_products > 0 ){
                    valid_catalog_url_count++;
                    console.log( "valid_catalog_url_count :: " + valid_catalog_url_count );
                    var new_website = 'amazon';
                    var new_data = {
                        url_text : response_data.url_text,
                        url : response_data.url,
                        count_first_page_products : new_count_first_page_products,
                        count_total_pages : response_data.total_pages,
                    };
                    add_new_catalog_url( new_website, new_data, function(response){
                        console.log( "--------------------------------------- :: " + response );
                        verify_valid_catalog_urls( data,  jquery_path, callback ); 
                    });
                }else{
                    verify_valid_catalog_urls( data,  jquery_path, callback );
                }
            }       
        }) 
    }
}



scraper_amazon.get_catalog_urls( amazon_category_list_url, jquery_path,  function( response_type, response_data ){
    console.log( "---------------------------------------------------------------------Start Checking For Catalog Urls" );
    if( response_type  == 'error'){
        console.log( "---------------------------------------------------------------------Error in getting catalog urls" );
    }else{
        data = response_data.urls
        console.log( "---------------------------------------------------------------------Start :: Total Urls Found  :: " + data.length );
        if( data.length > 0 ){
            //data = _.first( data , 50);
            //console.log( data );
            
            //process.exit(0);
            
            var check_n_pages = 1;
            verify_valid_catalog_urls( data,  jquery_path, function(){
                console.log('All Are Done');
                process.exit(0);
            });
        }
    }
});



module.exports = router;
