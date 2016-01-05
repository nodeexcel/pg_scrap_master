var Spooky = require('spooky');
var parser_aa = require('../modules/parser');
var scraper_catalog_products = require('../modules/scraper_catalog_products');

var cheerio = require('cheerio');

var module_website = 'amazon';
module.exports = {
    get_page_products : function( url, callback ){
        parser_aa.get_html( url, function ( response_type, response_data ){
            if( response_type == 'error' ){
                callback( 'error', response_data );
            }else{
                var products = [];
                jQuery = cheerio.load( response_data );
                if( jQuery('.s-result-list').find('li').length > 0 ){
                    jQuery('.s-result-list').find('li').each( function(){
                        
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
                jQuery = cheerio.load( response_data );
                var d_product_count_on_first_page = 0;
                var d_total_pages = 0;
                if( jQuery('.s-result-list').find('li').length > 0 ){
                    d_product_count_on_first_page = jQuery('.s-result-list').find('li').length;
                }
                if( jQuery('#pagn').find('.pagnDisabled').length > 0 ){
                    d_total_pages = jQuery('#pagn').find('.pagnDisabled').text().trim();
                    if( d_total_pages > 0 ){
                        sample_pagination_url = 'http://www.amazon.in' + jQuery('#pagn').find('span.pagnLink').find('a').attr('href');
                        for( var i = 1 ; i <= d_total_pages; i++  ){
                            page = 'page=' + i;
                            pagination_url = sample_pagination_url.replace( 'page=2', page );
                            pagination_urls.push( pagination_url );
                        }
                    }
                }
                if( pagination_urls.length == 0 && d_product_count_on_first_page > 0 ){
                    pagination_urls.push( url );
                }
                
                if( jQuery('a').length > 0 ){
                    jQuery('header').remove();
                    jQuery('#navFooter').remove();
                    jQuery('#rhf').remove();
                    if( jQuery('a').length > 0 ){
                        jQuery('a').each( function(){
                            link = jQuery(this).attr('href');
                            if( typeof link != 'undefined'){
                                link_text =  jQuery(this).text();
                                link_text = link_text.trim();
                                if( link.trim() != '' && link_text.trim() != '' && link.indexOf('/') != -1 && link.indexOf('/product-reviews/') == -1 && link.indexOf('/gp/voting/') == -1 
                                        && link.indexOf('/review/') == -1 && link.indexOf('/gp/pdp/profile') == -1 && link.indexOf('.pdf') == -1 ){
                                    link = link.trim();
                                    if( link.indexOf('amazon.in') == -1 ){
                                        link = 'http://www.amazon.in' + link;
                                    }
                                    row = {
                                        url : link,
                                        text : link_text 
                                    }
                                    all_urls.push( row );
                                }
                            }
                            //all_urls.push( jQuery(this).attr('href'));
                        })
                    }
                    //all_urls.push( all_urls.length );
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
                    //console.log( response_data );
                    jQuery = cheerio.load( response_data );
                    
                    found_urls = [];
                    
                        
                    if( jQuery('li').find('a').length > 0 ){
                        jQuery('li').find('a').each( function(){
                            link = jQuery(this).attr('href');
                            link_text =  jQuery(this).text();
                            link_text = link_text.trim();
                            if( link.trim() != '' ){
                                link = 'http://www.amazon.in' + link;
                                row = {
                                    url : link,
                                    text : link_text 
                                }
                                
                                found_urls.push( row );
                            }
                        })
                    }
                        
                    

                    var d_product_count_on_first_page = 0;
                    var d_total_pages = 0;
                    if( jQuery('#mainResults').find('li').length > 0 ){
                        d_product_count_on_first_page = jQuery('#mainResults').find('li').length;
                    }
                    if( jQuery('#pagn').find('.pagnDisabled').length > 0 ){
                        d_total_pages = jQuery('#pagn').find('.pagnDisabled').text().trim();
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

