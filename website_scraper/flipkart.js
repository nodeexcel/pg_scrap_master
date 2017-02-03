var _ = require('lodash');
var affiliate = require('flipkart-affiliate-client');
var client = affiliate.createClient({
    FkAffId: 'manishexce',
    FkAffToken: '5e7d179f81d548a58d44b9d17d2cd0f2',
    responseType: 'json'
});

module.exports = {
    get_page_products: function (url, callback) {
        client.getProductsFeed({
            trackingId: 'manishexce',
            url: url
        }, function (err, result) {
            if (!err) {
                var products = [];
                var a = JSON.parse(result);
                _.each(a.productInfoList, function (val, key) {
                    var name = val.productBaseInfoV1.title;
                    var image = val.productBaseInfoV1.imageUrls.unknown;
                    var href = val.productBaseInfoV1.productUrl;
                    var price = val.productBaseInfoV1.flipkartSellingPrice.amount;
                    var unique = val.productBaseInfoV1.productId;
                    product = {
                        name: name,
                        img: image,
                        href: href,
                        price: price,
                        unique: unique
                    }
                    products.push(product);
                })
                callback('success', products);
            } else {
                callback('error', response_data);
            }
        });
    },
    analyse_catalog_url: function (url_level, url, url_text, jquery_path, callback) {
        client.getProductsFeed({
            trackingId: 'manishexce',
            url: url
        }, function (err, result) {
            if (!err) {
                var a = JSON.parse(result);
                if (result) {
                    ff = {
                        url_level: '1',
                        url: url,
                        url_text: url_text,
                        product_count_on_first_page: a.productInfoList.length,
                        total_pages: '1',
                        sample_pagination_url: '',
                        pagination_urls: [url],
                        all_urls: [],
                    }
                    callback('success', ff);
                }
            } else {
                callback('error', err);
            }
        });
    },
    get_catalog_urls: function (url, jquery_path, callback) {
        if (typeof url == 'undefined' || url == '') {

        } else {
            client.getCategoryFeed({
                trackingId: 'manishexce'
            }, function (err, result) {
                if (!err) {
                    found_urls = [];
                    var a = JSON.parse(result);
                    var b = a.apiGroups.affiliate.apiListings;
                    _.each(b, function (key, val) {
                        _.each(key, function (key1, val1) {
                            _.each(key1, function (key2, val2) {
                                if (key2.get) {
                                    if (val2 == 'v1.1.0') {
                                        var link = key2.get;
                                        link_text = key2.resourceName;
                                        link_text = link_text.replace(/\\"/g, '');
                                        link_text = link_text.trim();
                                        row = {
                                            url: link,
                                            text: link_text
                                        }
                                        found_urls.push(row);
                                    }
                                }
                            })
                        })
                    })
                    ff = {
                        urls: found_urls,
                    }
                    callback('success', ff);
                } else {
                    callback('error', ff);
                }
            });
        }
    }
}