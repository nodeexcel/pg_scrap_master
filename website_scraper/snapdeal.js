var Spooky = require('spooky');
var parser_aa = require('../modules/parser');
var scraper_catalog_products = require('../modules/scraper_catalog_products');
var cheerio = require('cheerio');

var GENERIC = require('../modules/generic');

var module_website = 'Snapdeal';
module.exports = {
    get_page_products: function (url, callback) {
        parser_aa.get_html(url, function (response_type, response_data) {
            if (response_type == 'error') {
                callback('error', response_data);
            } else {
                var products = [];

                jQuery = cheerio.load(response_data);
                if (jQuery('.product-tuple-listing').length > 0) {
                    jQuery('.product-tuple-listing').each(function () {
                        unique = scraper_catalog_products.getUnique(module_website, jQuery(this));
                        name = scraper_catalog_products.getName(module_website, jQuery(this));
                        price = scraper_catalog_products.getPriceText(module_website, jQuery(this));
                        image = scraper_catalog_products.getImage(module_website, jQuery(this));
                        href = scraper_catalog_products.getHref(module_website, jQuery(this));
                        product = {
                            name: name,
                            img: image,
                            href: href,
                            price: price,
                            unique: unique
                        }
                        products.push(product);
                    });
                }
                callback('success', products);
            }
        })
    },
    analyse_catalog_url: function (url_level, url, url_text, jquery_path, callback) {
        parser_aa.get_html(url, function (response_type, response_data) {
            if (response_type == 'error') {
                // callback( 'error', response_data );
            } else {
                all_urls = [];
                pagination_urls = [];
                sample_pagination_url = '';
                var d_total_pages = 0;
                try {
                    jQuery = cheerio.load(response_data);
                    var d_product_count_on_first_page = 0;
                    var d_total_pages = 0;

                    var view_all_links = [];

                    if (jQuery('a').length > 0) {
                        jQuery('a').each(function () {
                            txt = jQuery(this).text();
                            txt = txt.toLowerCase();
                            if (txt == 'view all') {
                                txt_link = jQuery(this).attr('href');
                                if (typeof txt_link != 'undefined' && txt_link != '') {
                                    row = {
                                        url: txt_link,
                                        text: 'View All'
                                    }
                                    view_all_links.push(row);
                                }
                            }
                        })
                    }
                    var total_count_products = jQuery('#numberFound').val();
                    var product_count_per_page = jQuery('.product-tuple-listing').length;
                    if (product_count_per_page != '' && total_count_products != '') {
                        d_total_pages = total_count_products / product_count_per_page;
                        d_total_pages = Math.ceil(d_total_pages * 1);
                        if (d_total_pages > 100) {
                            d_total_pages = 100;
                        }
                    }
                    if (d_total_pages != 0) {
                        start = 1;
                        page = 20;
                        var cat_id = jQuery('#labelId').val();
                        while (start < d_total_pages) {
                            if (url.indexOf('?') == -1) {
                                sample_pagination_url = 'https://www.snapdeal.com/acors/json/product/get/search/' + cat_id + '/' + page + '/20?q=&sort=plrty&brandPageUrl=&keyword=&searchState=previousRequest=true|serviceabilityUsed=false|filterState=null&pincode=&vc=&webpageName=categoryPage&campaignId=&brandName=&isMC=false&clickSrc=unknown&showAds=true&cartId=&page=cp';
                            }
                            pagination_urls.push(sample_pagination_url);
                            page = start * 20;
                            start = start + 1;
                        }
                    }




                    if (view_all_links.length > 2) {
                        d_product_count_on_first_page = 0;
                        all_urls = view_all_links;
                    } else {
                        if (jQuery('.product-tuple-listing').length > 0) {
                            d_product_count_on_first_page = jQuery('.product-tuple-listing').length;
                        }
                        if (pagination_urls.length == 0 && d_product_count_on_first_page > 0) {
                            pagination_urls.push(url);
                        }
                        //below code is to extract sub categories listed on left hand side
                        if (jQuery('.sub-cat-wrapper').find('li.sub-cat-list').find('a').length > 0) {
                            jQuery('.sub-cat-wrapper').find('li.sub-cat-list').find('a').each(function () {
                                link = jQuery(this).attr('href');
                                if (typeof link != 'undefined') {
                                    link = link.trim();
                                    if (link != '') {
                                        link_text = jQuery(this).find('div.sub-cat-name').text();
                                        link_text = link_text.trim();
                                        link = link.trim();
                                        if (link.indexOf('snapdeal.com') == -1) {
                                            link = 'http://www.snapdeal.com' + link;
                                        }
                                        row = {
                                            url: link,
                                            text: link_text
                                        }
                                        all_urls.push(row);
                                    }
                                }
                            })
                        }
                    }
                    ff = {
                        url_level: url_level,
                        url: url,
                        url_text: url_text,
                        product_count_on_first_page: d_product_count_on_first_page,
                        total_pages: d_total_pages,
                        sample_pagination_url: sample_pagination_url,
                        pagination_urls: pagination_urls,
                        all_urls: all_urls,
                    }
                    callback('success', ff);
                } catch (err) {
                    callback('error', err);
                }
            }
        })
    },
    get_catalog_urls: function (url, jquery_path, callback) {
        if (typeof url == 'undefined' || url == '') {

        } else {
            parser_aa.get_html(url, function (response_type, response_data) {
                console.log(response_type);
                if (response_type == 'error') {
                    console.log('s');
                    callback('error', ff);
                } else {
                    found_urls = [];
                    jQuery = cheerio.load(response_data);
                    if (jQuery('a').length > 0) {
                        jQuery('header').remove();
                        jQuery('.SmBox1').remove();
                        jQuery('#sdFooter').find('.middleContent-footer').remove();
                        jQuery('a').each(function () {
                            link = jQuery(this).attr('href');
                            if (typeof link != 'undefined' && link.trim() != '') {
                                link_text = jQuery(this).text();
                                link_text = link_text.trim();
                                row = {
                                    url: link,
                                    text: link_text
                                }
                                found_urls.push(row);
                            }
                        })
                    }
                    ff = {
                        urls: found_urls,
                    }
                    callback('success', ff);
                }
            })
        }
    }
}
