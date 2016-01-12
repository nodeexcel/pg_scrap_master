var PARSER = require('../modules/parser');

var _ = require('underscore');
//*******************************************************************************************************
var master_website_list = ['amazon','Flipkart','Snapdeal','paytm','shopclues'];
var MASTER_WEBSITE = false;
var args = process.argv.slice(2);

var test_url = "";

if (args.length == 0) {
    console.log('Please pass a urlto start. So DIE!!!');
    process.exit(0);
}else{
    test_url = args[0];
}

//*******************************************************************************************************
var scraper_amazon = require('../website_scraper/amazon');
var scraper_flipkart = require('../website_scraper/flipkart');
var scraper_snapdeal = require('../website_scraper/snapdeal');
//*******************************************************************************************************
var jquery_path = '../public/js/jquery-1.8.3.min.js';


var GENERIC = require('../modules/generic');

var date = require('date-and-time');

var CONFIG_scrap_number_of_pagination = 5; // total number og pages to scrap per catalog url, set 0 for all i.e to scrap all pagination pages
var CONFIG_scrap_pages_at_a_time = 1; // number of urls to scrap at a time

function get_website_scraper_object( website ){
    if( website == 'Flipkart'){
        return scraper_flipkart;
    }else if( website == 'amazon'){
        return scraper_amazon;
    }else if( website == 'Snapdeal'){
        return scraper_snapdeal;
    }
    return false;
}

if( test_url.indexOf('flipkart') != -1 ){
    scraper_master_website = scraper_flipkart;
}else if( test_url.indexOf('amazon') != -1 ){
    scraper_master_website = scraper_amazon;
}else if( test_url.indexOf('snapdeal') != -1 ){
    scraper_master_website = scraper_snapdeal;
}

console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
console.log(test_url);
console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

scraper_master_website.get_page_products( test_url, function( res_type, res_data ){
    console.log( res_data );
    console.log( res_type );
})

