var express = require('express');
var router = express.Router();
var _ = require('underscore');

//*******************************************************************************************************
//*******************************************************************************************************
var master_website_list = ['amazon','Flipkart','Snapdeal','paytm','shopclues'];
var MASTER_WEBSITE = false;
var args = process.argv.slice(2);
if (args.length == 0) {
    console.log('Please pass a master website to start. So DIE!!!');
    process.exit(0);
}else{
    arg_website = args[0];
    if( _.contains( master_website_list, arg_website ) ){
        MASTER_WEBSITE = arg_website;
        //console.log( arg_website + " :: is a valid master website" );
    }else{
        console.log( arg_website + " :: is not a valid master website. So DIE!!!" );
        process.exit(0);
    }
}
console.log('Master Website :: '+ MASTER_WEBSITE);
//*******************************************************************************************************
//*******************************************************************************************************
var conn_catalog_urls = require('../models/catalog_urls');
var jquery_path = '../public/js/jquery-1.8.3.min.js';

var GENERIC = require('../modules/generic');

var scraper_amazon = require('../website_scraper/amazon');
var scraper_flipkart = require('../website_scraper/flipkart');
var scraper_snapdeal = require('../website_scraper/snapdeal');
var scraper_paytm = require('../website_scraper/paytm');

var amazon_category_list_url = "http://www.amazon.in/gp/site-directory/ref=nav_shopall_btn";
var flipkart_category_list_url = "http://www.flipkart.com/xhr/getNewMenuHtml";
var snapdeal_category_list_url = "http://www.snapdeal.com/page/sitemap";
var paytm_category_list_url = "https://catalog.paytm.com/v1//web/menu?channel=web&version=2";

if( MASTER_WEBSITE == 'amazon' ){
    scraper_master_website = scraper_amazon;
    website_category_list_url = amazon_category_list_url;
}else if( MASTER_WEBSITE == 'Flipkart' ){
    scraper_master_website = scraper_flipkart;
    website_category_list_url = flipkart_category_list_url;
}else if( MASTER_WEBSITE == 'Snapdeal' ){
    scraper_master_website = scraper_snapdeal;
    website_category_list_url = snapdeal_category_list_url;
}else if( MASTER_WEBSITE == 'paytm' ){
    scraper_master_website = scraper_paytm;
    website_category_list_url = paytm_category_list_url;
}
//*******************************************************************************************************
//*******************************************************************************************************
var valid_catalog_url_count = 0;
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
            url : new_url
            //url_text : new_url_text
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
                        url_level : new_data.url_level,
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
    console.log("\n");
    console.log('Waiting Time : 15 Seconds....................');
    GENERIC.wait(15000);
    console.log("\n");
    console.log( "---------------------------------------------------------------------Total Urls Pending To Check  :: " + data.length );
    if( data.length == 0 ){
        callback('0 Urls left to check hence callback is called');
    }else{
        url_data = data[0];
        data.splice(0, 1); //remove first item
        
        var url = url_data.url;
        var url_text = url_data.text;
        var url_check_level = url_data.check_level;
        
        console.log( "---------------------------------------------------------------------Checking Url Check Level :: " + url_check_level );
        console.log( "---------------------------------------------------------------------Checking Url :: " + url );
        console.log( "---------------------------------------------------------------------Checking Url Text :: " + url_text );
        
        scraper_master_website.analyse_catalog_url( url_check_level, url, url_text,  jquery_path, function( response_type, response_data ){
            console.log( "---------------------------------------------------------------------Checking Response :: " + response_type );
            if( response_type == 'error'){
                verify_valid_catalog_urls( data, jquery_path, callback )
            }else{
                var new_count_first_page_products = response_data.product_count_on_first_page;
                console.log( "--------------------------------------- Products Found On First Page :: " + new_count_first_page_products );
                if( new_count_first_page_products > 0 ){
                    valid_catalog_url_count++;
                    console.log( "valid_catalog_url_count :: " + valid_catalog_url_count );
                    var new_data = {
                        url_text : response_data.url_text,
                        url : response_data.url,
                        count_first_page_products : new_count_first_page_products,
                        count_total_pages : response_data.total_pages,
                        url_level : url_check_level,
                    };
                    add_new_catalog_url( MASTER_WEBSITE, new_data, function(response){
                        console.log( "--------------------------------------- :: " + response );
                        verify_valid_catalog_urls( data,  jquery_path, callback ); 
                    });
                }else{
                    console.log( data.length );
                    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    
                    
                    var CONFIG_LAST_LEVEL_CHECK = 0;
                    if( MASTER_WEBSITE  == 'Snapdeal'){
                        CONFIG_LAST_LEVEL_CHECK = 1;
                    }
                    
                    if( typeof response_data.url_level != 'undefined' && response_data.url_level <= CONFIG_LAST_LEVEL_CHECK ){
                        if( typeof response_data.all_urls != 'undefined' ){
                            all_urls = response_data.all_urls;
                            if( all_urls.length > 0 ){
                                _.each( all_urls, function( v, key ){
                                    row = v;
                                    row['check_level'] = response_data.url_level + 1;
                                    data.unshift( row ); // adding new urls which were received after n level url analysed
                                })
                            }
                        }
                        
                        //console.log( response_data );
                        //console.log( url );
                        //console.log( url_text );
                    }
                    
                    console.log( data.length );
                    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    
                    console.log('no products found on page');
                    //process.exit(0);
                    verify_valid_catalog_urls( data,  jquery_path, callback );
                }
            }       
        }) 
    }
}
scraper_master_website.get_catalog_urls( website_category_list_url, jquery_path,  function( response_type, response_data ){
    console.log( "---------------------------------------------------------------------Start Checking For Catalog Urls" );
    if( response_type  == 'error'){
        console.log( "---------------------------------------------------------------------Error in getting catalog urls" );
    }else{
        data = response_data.urls
        console.log( "---------------------------------------------------------------------Start :: Total Urls Found  :: " + data.length );
        if( data.length > 0 ){
            _.each( data, function( v, key){
                data[key]['check_level'] = 0;
            })
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
