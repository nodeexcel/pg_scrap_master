var express = require('express');
var router = express.Router();

var conn_catalog_urls = require('../models/catalog_urls');
var conn_scrap_data_amazon = require('../models/scrap_data_amazon');
var _ = require('underscore');
var jquery_path = '../public/js/jquery-1.8.3.min.js';
var scraper_amazon = require('../website_scraper/amazon');

var amazon_category_list_url = "http://www.amazon.in/gp/site-directory/ref=nav_shopall_btn";

//http://www.amazon.in/Kindle-Accessories/b/ref=sd_allcat_k_kacce/279-8515975-7779503?ie=UTF8&node=1634751031
//http://www.amazon.in/Kindle-Accessories/b/ref=sd_allcat_k_kacce/279-8515975-7779503?ie=UTF8&node=1634751031
//http://www.amazon.in/Kindle-Accessories/b/ref=sd_allcat_k_kacce/279-8515975-7779503?ie=UTF8&node=1634751031
//http://www.amazon.in/Kindle-Accessories/b/ref=sd_allcat_k_kacce/280-1677586-4623502?ie=UTF8&node=1634751031

function add_new_catalog_url( website, new_data ){
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^NEW CATALOG URL^^^^^^^^^^^^^^^^^^^^^');
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
    
    var new_url = new_data.url;
    new_url = new_url.trim();
    
    if( typeof new_url == 'undefined' || new_url == '' ){        
        
    }else{
        where = {
            website : website,
            url : new_url
        }
        conn_catalog_urls.find( where, function( err, result ){
            console.log( where );
            console.log( result );
            if( err ){
                
            }else{
                if( typeof result != 'undefined' && result.length > 0 ){
                    console.log('-----CATALOG URL ALREADY EXISTS');
                }else{
                    var new_catalog_url = {
                        website : website,
                        url : new_url,
                        count_first_page_products : new_data.count_first_page_products,
                        count_total_pages : new_data.count_total_pages,
                    }
                    var insert_new_catalog_url  = new conn_catalog_urls( new_catalog_url );
                    insert_new_catalog_url.save( function(){
                        console.log( new_catalog_url );
                        console.log('-----CATALOG URL INSERTED');
                        
                        process.exit(0);
                        
                    })
                }
            }
        })
    }
}


function verify_valid_catalog_urls( data, start_key, jquery_path ){
    
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

        scraper_amazon.analyse_catalog_url( start_key, u, jquery_path, function( response_type, response_data ){
            if( response_type == 'error'){
                console.log('ERROR oCCURS')
                console.log( response_data);
                start_key = start_key + 1;
                verify_valid_catalog_urls( data, start_key, jquery_path )
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
                verify_valid_catalog_urls( data, start_key, jquery_path )

            }       
        }) 
    }
}

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
            var dd = verify_valid_catalog_urls( data, 0, jquery_path );
        }
    }
});



module.exports = router;
