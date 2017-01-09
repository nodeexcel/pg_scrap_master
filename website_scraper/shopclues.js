var Spooky = require('spooky');
var parser_aa = require('../modules/parser');
var scraper_catalog_products = require('../modules/scraper_catalog_products');
var cheerio = require('cheerio');
var GENERIC = require('../modules/generic');
var module_website = 'shopclues';

module.exports = {
    get_page_products: function (url, callback) {
        parser_aa.get_html(url, function (response_type, response_data) {
            if (response_type == 'error') {
                callback('error', response_data);
            } else {
                var products = [];
                jQuery = cheerio.load(response_data);
                if (jQuery('.col3').length > 0) {
                    jQuery('.col3').each(function () {
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
                callback('error', response_data);
            } else {
                all_urls = [];
                pagination_urls = [];
                sample_pagination_url = ''
                try {
                    jQuery = cheerio.load(response_data);
                    var d_product_count_on_first_page = 0;
                    var d_total_pages = 0;
                    if (jQuery('.col3').find('h3').length > 0) {
                        d_product_count_on_first_page = jQuery('.col3').find('h3').length;
                    }
                    if (typeof jQuery('.col3').find('h3').length != 'undefined') {
                        products_count = jQuery('.col3').find('h3').length;
                        total_count_products = jQuery('.col3').find('h3').length;
                        if (products_count != '' && total_count_products != '') {
                            d_total_pages = total_count_products / products_count;
                            d_total_pages = d_total_pages * 1;
                        }
                    }
                    if (d_total_pages != 0) {
                        start = 1;
                        while (start < d_total_pages) {
                            if (url.indexOf('?') == -1) {
                                sample_pagination_url = url + '?page=' + start;
                            } else {
                                sample_pagination_url = url + '&page=' + start;
                            }
                            pagination_urls.push(sample_pagination_url);
                            start = start + 1;
                            if (start == 20) {
                                start = 1000;
                            }
                        }
                    }
                    if (pagination_urls.length == 0 && d_product_count_on_first_page > 0) {
                        pagination_urls.push(url);
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
                if (response_type == 'error') {
                    callback('error', ff);
                } else {
                    found_urls = [];
                    jQuery = cheerio.load(response_data);
                    if (jQuery('.scfooter_Category').find('ul').find('li').find('a').length > 0) {
                        jQuery('.scfooter_Category').find('ul').find('li').find('a').each(function () {
                            link = jQuery(this).attr('href');
                            if (link.trim() != '') {
                                if (link.indexOf('shopclues.com') == -1) {
                                    link = 'http://www.shopclues.com' + link;
                                }
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