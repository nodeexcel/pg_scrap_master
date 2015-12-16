var Spooky = require('spooky');

var parser_aa = require('../modules/parser');

var cheerio = require('cheerio');

module.exports = {
    get_page_products : function( url, callback ){
        console.log( 'SCRAPING PRODUCTS FROM :: '+ url );
        parser_aa.get_html( url, function ( response_type, response_data ){
            if( response_type == 'error' ){
                callback( 'error', response_data );
            }else{
                var products = [];
                jQuery = cheerio.load( response_data );
                
                if( jQuery('.s-result-list').find('li').length > 0 ){
                    jQuery('.s-result-list').find('li').each( function(){
                        var name = jQuery(this).find('a.s-access-detail-page').attr('title');
                        var url = jQuery(this).find('a.s-access-detail-page').attr('href');
                        var image = jQuery(this).find('img.s-access-image').attr('src');
                        var price = 0;
                        if( jQuery(this).find('span.a-color-price').length > 0 ){
                            jQuery(this).find('span.currencyINR').remove();
                            price = jQuery(this).find('span.a-color-price').text();
                        }
                        product = {
                            name : name,
                            url : url,
                            image : image,
                            price : price
                        }
                        
                        products.push( product );
                        
                    });
                }
                
                
                
                callback( 'success', products );
            }
        })
        
        
    },
    analyse_catalog_url: function( key_manager, url,jquery_path, callback ) {
        console.log( 'START CATALOG URL :: ' + url );
        
        parser_aa.get_html( url, function ( response_type, response_data ){
            //console.log( 'response_type :: ' + response_type );
            if( response_type == 'error'){
                //console.log('s');
                callback( 'error', response_data );
            }else{
                pagination_urls = [];
                sample_pagination_url = ''
                //console.log( response_data );
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
                
                ff =  {
                    key : key_manager,
                    url : url,
                    product_count_on_first_page : d_product_count_on_first_page,
                    total_pages : d_total_pages,
                    sample_pagination_url : sample_pagination_url,
                    pagination_urls : pagination_urls
                }
                
                
                console.log(ff);
                
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
                            var link = jQuery(this).attr('href');
                            if( link.trim() != '' ){
                                link = 'http://www.amazon.in' + link;
                                found_urls.push( link );
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

