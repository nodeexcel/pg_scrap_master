var Spooky = require('spooky');
var parser_aa = require('../modules/parser');
var scraper_catalog_products = require('../modules/scraper_catalog_products');
var cheerio = require('cheerio');

var GENERIC = require('../modules/generic');

var module_website = 'paytm';


function getItemsUrls( items ){
    var urls = [];
    for( var k in items ){
        if( typeof items[k]['items'] != 'undefined' && items[k]['items'].length > 0 ){
            aa = getItemsUrls( items[k]['items'] );
            if( aa.length > 0 ){
                for( var n in aa ){
                    urls.push( aa[n] );
                }
            }
        }else{
            url = '';
            url_name = '';
            if( typeof items[k]['name'] != 'undefined' && items[k]['name'] != '' && items[k]['url'] != 'undefined' && items[k]['url'] != ''){
                row = {
                    url : items[k]['url'],
                    text : items[k]['name']
                }
                urls.push( row );
            }
        }
    }
    return urls;
}


module.exports = {
    get_page_products : function( url, callback ){
        parser_aa.get_html( url, function ( response_type, response_data ){
            if( response_type == 'error' ){
                callback( 'error', response_data );
            }else{
                var products = [];
                response_data = JSON.parse( response_data );
                if( typeof response_data['grid_layout'] != 'undefined' && response_data['grid_layout'].length > 0 ){
                    grid_layout = response_data['grid_layout'];
                    for( var k in grid_layout ){
                        p = grid_layout[k];
                        unique = scraper_catalog_products.getUnique( module_website, p );
                        name = scraper_catalog_products.getName( module_website, p );
                        price = scraper_catalog_products.getPriceText( module_website, p );
                        image = scraper_catalog_products.getImage( module_website, p );
                        href = scraper_catalog_products.getHref( module_website, p );
                        product = {
                            name : name,
                            img : image,
                            href : href,
                            price : price,
                            unique : unique
                        }
                        products.push( product );
                    }
                }
                callback( 'success', products );
            }
        })
    },
    analyse_catalog_url: function( url_level, url, url_text, jquery_path, callback ) {
        parser_aa.get_html( url, function ( response_type, response_data ){
            if( response_type == 'error'){
                callback( 'error', response_data );
            }else{
                all_urls = [];
                pagination_urls = [];
                sample_pagination_url = ''
                try{
                    var d_product_count_on_first_page = 0;
                    var d_total_pages = 0;
                    response_data = JSON.parse( response_data );
                    if( typeof response_data['grid_layout'] != 'undefined' && response_data['grid_layout'].length > 0 ){
                        d_product_count_on_first_page = response_data['grid_layout'].length;
                        for( var i = 1 ; i <= 10; i++  ){
                            page = 'page=' + i;
                            if( url.indexOf('?') != '-1'){
                                pagination_url = url+'&page_count='+i
                            }else{
                                pagination_url = url+'?page_count='+i
                            }
                            pagination_urls.push( pagination_url );
                        }
                        d_total_pages = 10;
                    }
                    if( pagination_urls.length == 0 && d_product_count_on_first_page > 0 ){
                        pagination_urls.push( url );
                    }
                    ff =  {
                        url_level: url_level,
                        url : url,
                        url_text : url_text,
                        product_count_on_first_page : d_product_count_on_first_page,
                        total_pages : d_total_pages,
                        sample_pagination_url : sample_pagination_url,
                        pagination_urls : pagination_urls,
                        all_urls : all_urls,
                    }
                    callback( 'success', ff );
                }catch( err ){
                    callback( 'error', err );
                }
            }
        })
    },
    get_catalog_urls : function( url,jquery_path, callback ) {
        if( typeof url == 'undefined' || url == ''){
            
        }else{
            parser_aa.get_html( url, function ( response_type, response_data ){
                console.log( response_type );
                if( response_type == 'error'){
                    console.log('s');
                    callback( 'error', ff );
                }else{
                    found_urls = [];
                    response_data = JSON.parse( response_data );
                    response_data = response_data['items'];
                    found_urls = getItemsUrls( response_data );
                    ff =  {
                        urls : found_urls,
                    }
                    callback( 'success', ff );
                }
            })
        }
    }
}

