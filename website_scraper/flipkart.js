var Spooky = require('spooky');
var parser_aa = require('../modules/parser');
var scraper_catalog_products = require('../modules/scraper_catalog_products');
var cheerio = require('cheerio');

var GENERIC = require('../modules/generic');


var module_website = 'Flipkart';
module.exports = {
    get_page_products : function( url, callback ){
        parser_aa.get_html( url, function ( response_type, response_data ){
            if( response_type == 'error' ){
                callback( 'error', response_data );
            }else{
                var products = [];
                jQuery = cheerio.load( response_data );
                if( jQuery('div.product-unit').length > 0 ){
                    jQuery('div.product-unit').each( function(){
                        unique = scraper_catalog_products.getUnique( module_website, jQuery(this) );
                        name = scraper_catalog_products.getName( module_website, jQuery(this) );
                        price = scraper_catalog_products.getPriceText( module_website, jQuery(this) );
                        image = scraper_catalog_products.getImage( module_website, jQuery(this) );
                        href = scraper_catalog_products.getHref( module_website, jQuery(this) );
                        product = {
                            name : name,
                            img : image,
                            href : href,
                            price : price,
                            unique : unique
                        }
                        products.push( product );
                    });
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
                    jQuery = cheerio.load( response_data );
                    var d_product_count_on_first_page = 0;
                    var d_total_pages = 0;
                    
                    if( jQuery('div.product-unit').length > 0 ){
                        d_product_count_on_first_page = jQuery('div.product-unit').length;
                    }
                    if( typeof jQuery('#searchCount').find('span.count') != 'undefined' && jQuery('#searchCount').find('span.items') != 'undefined'){
                        var count_per_page = jQuery('#searchCount').find('span.count').text();
                        var count_total = jQuery('#searchCount').find('span.items').text();
                        count_total = GENERIC.getCleanNumber( count_total );
                        if( count_per_page > 0 &&  count_total > 0 ){
                            var total_pages = count_total / count_per_page;
                            var start = 1;
                            if( total_pages > 0 ){
                                for( var i = total_pages; i > 0 ; i -- ){
                                    sample_pagination_url = url+'&start='+start;
                                    pagination_urls.push( sample_pagination_url );
                                    i = i - count_per_page;
                                    start = start*1 + count_per_page*1;
                                    if( pagination_urls.length > 20 ){
                                        i = 0;
                                    }
                                }
                            }
                        }
                    }
                    if( pagination_urls.length == 0 && d_product_count_on_first_page > 0 ){
                        pagination_urls.push( url );
                    }
                    if( jQuery('a').length > 0 ){
                        jQuery('.menu-wrapper').remove();
                        jQuery('#fcWrap').remove();
                        jQuery('#fk-mainfooter-id').remove();
                        jQuery('#fk-mainhead-id').remove();
                        
                        jQuery('a').each( function(){
                            link = jQuery(this).attr('href');
                            if( typeof link != 'undefined'){
                                link = link.trim();
                                if( link != ''){
                                    if( link.indexOf('javascript:void(0)') == -1 && link.indexOf('.pdf') == -1 ){
                                        link_text =  jQuery(this).text();
                                        link_text = link_text.trim();
                                        link = link.trim();
                                        if( link.indexOf('flipkart.com') == -1 ){
                                            link = 'http://www.flipkart.com' + link;
                                        }
                                        row = {
                                            url : link,
                                            text : link_text 
                                        }
                                        all_urls.push( row );
                                    }
                                }
                            }
                        })
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
                    response_data=JSON.parse(response_data);
                    found_urls = [];
                    for( var k in response_data ){
                        jQuery = cheerio.load( response_data[k] );
                        if( jQuery('a').length > 0 ){
                            jQuery('a').each( function(){
                                link = jQuery(this).attr('href');
                                if( link.trim() != '' ){
                                    link = 'http://www.flipkart.com' + link;
                                    link_text =  jQuery(this).text();
                                    link_text = link_text.replace(/\\"/g, '');
                                    link_text = link_text.trim();
                                    row = {
                                        url : link,
                                        text : link_text 
                                    }
                                    found_urls.push( row );
                                }
                            })
                        }
                    }
                    ff =  {
                        urls : found_urls,
                    }
                    callback( 'success', ff );
                }
            })
        }
    }
}

