var express = require('express');
var router = express.Router();
var PARSER = require('../modules/parser');
var mongoose = require('mongoose')
var _ = require('lodash');
var moment = require('moment');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var smtpTransport = require('nodemailer-smtp-transport');
var mandrill = require('mandrill-api/mandrill');
var jwt = require('jwt-simple');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var conn_pg_catalog_urls = mongoose.createConnection('mongodb://127.0.0.1/pg_scrap_data');
var conn_pg_scrap_db1 = mongoose.createConnection('mongodb://127.0.0.1/scrap_db1');
var conn_pg_scrap_db2 = mongoose.createConnection('mongodb://127.0.0.1/scrap_db2');
//var conn_fiq_scrap_db3 = mongoose.createConnection('mongodb://144.76.83.246/scrap_db3');
var conn_fiq_scrap_db3 = mongoose.createConnection('mongodb://127.0.0.1/scrap_db3');
var schema_db1_website_scrap_data = mongoose.Schema({}, {
    strict: false,
    collection: 'website_scrap_data'
});
var schema_db2_website_scrap_data = mongoose.Schema({}, {
    strict: false,
    collection: 'website_scrap_data'
});
var schema_db3_website_scrap_data = mongoose.Schema({}, {
    strict: false,
    collection: 'website_scrap_data'
});
var pg_scrap_db1_website_scrap_data = conn_pg_scrap_db1.model('website_scrap_data', schema_db1_website_scrap_data);
var pg_scrap_db2_website_scrap_data = conn_pg_scrap_db2.model('website_scrap_data', schema_db2_website_scrap_data);
var fiq_scrap_db3_website_scrap_data = conn_fiq_scrap_db3.model('website_scrap_data', schema_db3_website_scrap_data);

var schema_catalog_urls = mongoose.Schema({}, {
    strict: false,
    collection: 'catalog_urls'
});
var conn_catalog_urls = conn_pg_catalog_urls.model('catalog_urls', schema_catalog_urls);
var schema_price_alerts_email_log = mongoose.Schema({}, {
    strict: false,
    collection: 'price_alerts_email_log'
});
var conn_price_alerts_email_log = conn_pg_scrap_db2.model('price_alerts_email_log', schema_price_alerts_email_log);

var users_schema = mongoose.Schema({}, {
    strict: false,
    collection: 'users'
});
var conn_user = conn_pg_scrap_db2.model('users', users_schema);

var gcms_schema = mongoose.Schema({}, {
    strict: false,
    collection: 'gcms'
});
var conn_gcms = conn_pg_scrap_db2.model('gcms', gcms_schema);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var _ = require('underscore');
//*******************************************************************************************************
var master_website_list = ['amazon', 'Flipkart', 'Snapdeal', 'paytm', 'shopclues'];
var MASTER_WEBSITE = false;
var args = process.argv.slice(2);
if (args.length == 0) {
    console.log('Please pass a master website to start. So DIE!!!');
    process.exit(0);
} else {
    arg_website = args[0];
    if (_.contains(master_website_list, arg_website)) {
        MASTER_WEBSITE = arg_website;
        //console.log( arg_website + " :: is a valid master website" );
    } else {
        console.log(arg_website + " :: is not a valid master website. So DIE!!!");
        process.exit(0);
    }
}
console.log('Master Website :: ' + MASTER_WEBSITE);
//*******************************************************************************************************
var scraper_amazon = require('../website_scraper/amazon');
var scraper_flipkart = require('../website_scraper/flipkart');
var scraper_snapdeal = require('../website_scraper/snapdeal');
var scraper_paytm = require('../website_scraper/paytm');
var scraper_shopclues = require('../website_scraper/shopclues');
//*******************************************************************************************************
var jquery_path = '../public/js/jquery-1.8.3.min.js';


var GENERIC = require('../modules/generic');
var PUSH_MESSAGE = require('../modules/push_message');
var MAIL = require('../modules/mail');
var date = require('date-and-time');

var CONFIG_scrap_number_of_pagination = 20; // total number og pages to scrap per catalog url, set 0 for all i.e to scrap all pagination pages
var CONFIG_scrap_pages_at_a_time = 1; // number of urls to scrap at a time // keep this 1 always

function get_website_scraper_object(website) {
    if (website == 'Flipkart') {
        return scraper_flipkart;
    } else if (website == 'amazon') {
        return scraper_amazon;
    } else if (website == 'Snapdeal') {
        return scraper_snapdeal;
    } else if (website == 'paytm') {
        return scraper_paytm;
    } else if (website == 'shopclues') {
        return scraper_shopclues;
    }
    return false;
}


function update_scrap_stats(rec_id, type, callback) {
    where = {
        "_id": rec_id,
    }
    conn_catalog_urls.findOne(where, function(err, result) {
        if (typeof result == 'undefined' || result.length == 0) {
            callback('record not found');
            return true;
        } else {
            var today_date = PARSER.currentDate();

            count_insert = 0;
            count_update = 0;
            date_wise_stats = result.get('date_wise_stats');
            if (typeof date_wise_stats == 'undefined') {
                date_wise_stats = {};
            } else {
                _.each(date_wise_stats, function(val, key) {
                    if (key == today_date) {
                        if (typeof val.insert != 'undefined') {
                            count_insert = val.insert;
                        }
                        if (typeof val.update != 'undefined') {
                            count_update = val.update;
                        }
                    }
                })
            }
            var to_be_update_data = {
                last_update_time: PARSER.currentTimestamp(),
                last_update_time_dt: PARSER.currentDateTimeDay(),
            }
            if (type == 'insert') {
                count_insert = count_insert + 1;
            }
            if (type == 'update') {
                count_update = count_update + 1;
            }
            date_wise_stats[today_date] = {
                'insert': count_insert,
                'update': count_update
            }
            if (count_insert == 0 && type == 'scrap_start') {
                to_be_update_data['scrap_status'] = 1;
                date_wise_stats[today_date] = {
                    'insert': 0,
                    'update': 0
                }
            }

            to_be_update_data['date_wise_stats'] = date_wise_stats;
            conn_catalog_urls.update(where, {
                $set: to_be_update_data
            }, function(err, res) {
                if (err) {
                    callback('error');
                    return true;
                } else {
                    callback('success');
                    return true;
                }
            });
        }
    })
}


function get_price_history_and_log(exist_product, new_data) {
    var exist_date = exist_product.get('date');
    var price_history = exist_product.get('price_history');
    if (typeof price_history == 'undefined' || !price_history || price_history == null) {
        price_history = [];
    }
    var price_log = exist_product.get('price_log');
    if (typeof price_log == 'undefined' || !price_log || price_log == null) {
        price_log = [];
    }
    if (new_data.price != '' && new_data.price > 0) {
        price_log_text = PARSER.currentDate() + '__' + PARSER.currentDateTimeDay() + '____' + new_data.price;
        price_log.push(price_log_text);

        var is_new_date_price = true;
        if (price_history.length == 0) {} else {
            for (var d in price_history) {
                dd = price_history[d];
                if (dd['date'] == PARSER.currentDate()) {
                    is_new_date_price = false;
                    price_history[d]['date'] = PARSER.currentDate();
                    price_history[d]['timestamp'] = PARSER.currentTimestamp();
                    price_history[d]['price'] = new_data.price * 1;
                }
            }
        }
        if (is_new_date_price == true) {
            price_history.push({
                date: PARSER.currentDate(),
                timestamp: PARSER.currentTimestamp(),
                price: new_data.price * 1
            });
        }
        if (price_history.length > 30) {
            price_history.shift();
        }
        if (price_log.length > 20) {
            price_log.shift();
        }
    }

    return {
        price_history: price_history,
        price_log: price_log
    };
}


function add_update_product(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, new_data, callback) {
    console.log('\n');
    console.log('\n');
    console.log('------------------------------------------------------------------------------');
    console.log('--------PRODUCT  :: add_update_product ::: START');
    console.log('------------------------------------------------------------------------------');
    console.log(new_data);
    console.log('------------------------------------------------------------------------------');
    if (typeof new_data.href == 'undefined' || typeof new_data.price == 'undefined' || typeof new_data.name == 'undefined' || new_data.href == '' || new_data.name == '') {
        callback('Product Info Issue');
        return true;
    }
    new_data.website = website;
    new_data.website_category = website_category;
    new_data.catalog_url_mongo_id = u_rec_id;
    new_data.cat_id = u_cat_id;
    new_data.sub_cat_id = u_sub_cat_id;
    var url = new_data.href;
    var unique = '';
    if (typeof new_data.unique != 'undefined' && new_data.unique != '') {
        unique = new_data.unique;
    } else {
        unique = GENERIC.getUniqueCode(website, url);
    }
    new_data.unique = unique;
    new_data.date_of_birth = PARSER.currentIsoDate();
    new_data.time = PARSER.currentTimestamp();
    new_data.time_pretty = PARSER.currentIsoDate();
    new_data.date = PARSER.currentDate();
    new_data.scrap_source = 'pg_scrap_master';
    //console.log( new_data.price);
    if (typeof new_data.price != 'undefined' && new_data.price != '') {
        new_data.price = GENERIC.getCleanNumber(new_data.price);
        if (new_data.price != 'undefined' && new_data.price != '' && new_data.price > 0) {
            new_data.price = new_data.price * 1;
        }
    }
    if (new_data.price == 0 || new_data.price == '' || new_data.price == 'undefined') {
        callback('Error Price Issue');
        return true;
    }
    where = {
        website: website,
        // unique: unique
        unique: 'B00B78P71Q'
    }
    var product_info = new_data;
    console.log('------------------------------------------------------------------------------');
    console.log(where);
    console.log('------------------------------------------------------------------------------');
    console.log(product_info);
    console.log('------------------------------------------------------------------------------');
    console.log('------------------------------------------------------------------------------');


    //////////////////////////////////////////////////////////////////////////////////////////////////////////


    pg_scrap_db2_website_scrap_data.find(where, function(err, result) {
        if (err) {
            callback('Error Occurs');
            return true;
        } else {
            if (result.length == 0) {
                //it means product is not found in 3 databases so it will be insert in scrap_db2 database of pricegenie
                console.log('Product Not Exists');
                if (new_data.price != '' && new_data.price > 0) {
                    product_info['price_history'] = [{
                        date: PARSER.currentDate(),
                        timestamp: PARSER.currentTimestamp(),
                        price: new_data.price * 1
                    }];
                    price_log_text = PARSER.currentDate() + '__' + PARSER.currentDateTimeDay() + '____' + new_data.price;
                    product_info['price_log'] = [price_log_text];
                }
                console.log("\n");
                console.log('Going To Insert');
                console.log(product_info);
                var insert_new_product = new pg_scrap_db2_website_scrap_data(product_info);
                insert_new_product.save(function() {
                    update_scrap_stats(u_rec_id, 'insert', function(aa) {
                        console.log('1 INSERT :: ' + aa);
                        callback('Products Inserted');
                        return true;
                    });
                })
            } else {
                exist_product = result[0];
                price_history_and_log = get_price_history_and_log(exist_product, new_data);
                to_be_update_data = {
                    date_of_birth: PARSER.currentIsoDate(),
                    price: new_data.price,
                    price_history: price_history_and_log.price_history,
                    price_log: price_history_and_log.price_log,
                    updated: 1,
                    time: PARSER.currentTimestamp(),
                    time_pretty: PARSER.currentIsoDate(),
                    date: PARSER.currentDate(),
                    scrap_source: 'pg_scrap_master',
                    cat_id: new_data.cat_id,
                    sub_cat_id: new_data.sub_cat_id,
                    catalog_url_mongo_id: new_data.catalog_url_mongo_id
                };
                console.log("\n");
                console.log('Going To Update ---SCRAP_DB2');
                console.log(to_be_update_data);
                console.log(exist_product._id)
                pg_scrap_db2_website_scrap_data.update(where, { '$set': to_be_update_data }, function(err, res) {
                    if (err) {
                        callback('Products Updated');
                        return true;
                    } else {
                        update_scrap_stats(u_rec_id, 'update', function(aa) {
                            console.log('1 UPdated :: ' + aa);
                            var new_data_price = new_data.price;
                            var exist_product_price = exist_product.get('price');
                            var genie_alerts = exist_product.get('genie_alerts');
                            if ((new_data_price < exist_product_price) && genie_alerts) {
                                var product_name = exist_product.get('name');
                                var product_url = exist_product.get('href');
                                var product_img = exist_product.get('img');
                                var subject = 'Price down alert - From ' + exist_product_price + ' to ' + new_data_price + '';
                                _.forEach(genie_alerts, function(val, key) {
                                    var email = val.email_id;
                                    var website = val.website;
                                    var from = 'noreply@pricegenie.co';
                                    if (website == 'fashionq') {
                                        from = 'noreply@fashioniq.in';
                                    }
                                    var current_date = moment().unix();
                                    var payload = { email: email, time: current_date };
                                    var secret = 'Pricegenie';
                                    conn_user.findOne({ email: email }, function(err, user) {
                                        if (err) {
                                            console.log(err)
                                        } else if (!user) {
                                            console.log('not found');
                                        } else {
                                            conn_gcms.findOne({ user_id: user._id.toString() }, function(error, resp) {
                                                if (error) {
                                                    console.log(err)
                                                } else if (!resp) {
                                                    console.log('not found');
                                                } else {
                                                    var push_token = resp.get('reg_id');
                                                    var payload = { product_id: exist_product._id };
                                                    var notify = {
                                                        title: 'Price down alert',
                                                        body: product_name + ' from ' + exist_product_price + 'rs to ' + new_data_price + 'rs',
                                                        click_action: "FCM_PLUGIN_ACTIVITY",
                                                        "color": "#f95b2c"
                                                    };
                                                    var serverKey = 'AAAAoDVUotg:APA91bGSSsdmlLFx9ihoi3Kq7XMrYr24pMKfL93j4M9p7qNg8eWeqYWmp9HSfbUhaqjZxEC9uvrXQ6_Fgs5mKUcov2xNKHqkKxUNx9Bd7rjhYJ2g7472Z-DxkPLZYv4cny8wah4w1LON';
                                                    PUSH_MESSAGE.push_notification(serverKey, push_token, payload, notify, function(error, response) {
                                                        if (error == 'error') {
                                                            console.log(response);
                                                        } else {
                                                            console.log(response);
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    })

                                    token_encode(payload, secret, function(token) {
                                        var token_link = 'http://pricegenie.co/my_genie_alerts.php?email=' + token;
                                        var html = '<html><head><style>td ,th{border-style: solid;border-color: grey;}</style></head><body><b>Hello</b><br><br>Greeting from Pricegenie. <br><br>Price is down.<br><br><a href=' + product_url + '><table style="width:100%"><tr align="center"><td colspan="4"><font size="5">' + product_name + '</font></td></tr><tr align="center"><th rowspan="2"><img src=' + product_img + ' alt="Smiley face" height="80" width="80"></th><th>Old price</th><th>New price</th><th rowspan="2"><button type="button" style="height:50px;width:auto">Buy now!</button></th></tr><tr align="center"><td>' + exist_product_price + '</td><td>' + new_data_price + '</td></tr></tr></table></a><br><br><a href="' + token_link + '">View all your Price Alerts</a></body></html>'
                                        MAIL.mail_alert(email, subject, 'template', from, html, function(response_msg, response_data, response) {
                                            if (response) {
                                                if (response.accepted) {
                                                    email_sent_status = 'sent';
                                                } else {
                                                    email_sent_status = 'not sent';
                                                }
                                                var email_info = {
                                                    email_sent_status: email_sent_status,
                                                    email_sent_response: response.response,
                                                    scrap_product_id: exist_product._id,
                                                    website: exist_product.get('website'),
                                                    time: PARSER.currentIsoDate(),
                                                    email_id: email,
                                                    old_price: exist_product_price,
                                                    new_price: new_data_price
                                                };
                                                var insert_email_info = new conn_price_alerts_email_log(email_info);
                                                insert_email_info.save(function(err, resp) {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {
                                                        console.log(resp);
                                                    }
                                                })
                                            }
                                        });
                                    });
                                });
                                console.log('email sent successfully');
                                callback('Products Updated');
                                return true;
                            } else {
                                callback('Products Updated');
                                return true;
                            }
                        });
                    }
                });
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////



    //    conn_website_scrap_data.find( where, function( err, result ){
    //        if( err ){
    //            callback('Error Occurs');
    //            return true;
    //        }else{
    //            if( typeof result == 'undefined' || result.length == 0 ){
    //                console.log('Product Not Exists');
    //                if( new_data.price != '' && new_data.price > 0 ){
    //                    product_info['price_history'] = [{
    //                        date: PARSER.currentDate(),
    //                        timestamp: PARSER.currentTimestamp(),
    //                        price: new_data.price*1
    //                    }];
    //                    price_log_text = PARSER.currentDate()+'__'+PARSER.currentDateTimeDay()+'____'+new_data.price;
    //                    product_info['price_log'] = [price_log_text];
    //                }
    //                console.log("\n");
    //                console.log('Going To Insert');
    //                console.log( product_info );
    //                var insert_new_product  = new conn_website_scrap_data( product_info );
    //                insert_new_product.save( function(){
    //                    update_scrap_stats( u_rec_id, 'insert', function( aa ){
    //                        console.log('1 INSERT :: '+aa);
    //                        callback('Products Inserted');
    //                        return true;
    //                    });
    //                })
    //            }else{
    //                console.log('Product Already Exists');
    //                exist_product = result[0];
    //                console.log('-----------------------------exist product-------------------------------------------------');
    //                console.log( exist_product );
    //                console.log('--------------------------------------------------------------------------------------------------');
    //                console.log( exist_product );
    //                
    //                var exist_date = exist_product.get('date');
    //                var price_history = exist_product.get('price_history');
    //                if (typeof price_history == 'undefined' || !price_history || price_history == null) {
    //                    price_history = [];
    //                }
    //                var price_log = exist_product.get('price_log');
    //                if (typeof price_log == 'undefined' || !price_log || price_log == null) {
    //                    price_log = [];
    //                }
    //                
    //                if( new_data.price != '' && new_data.price > 0 ){
    //                    price_log_text = PARSER.currentDate()+'__'+PARSER.currentDateTimeDay()+'____'+new_data.price;
    //                    price_log.push( price_log_text );
    //                    
    //                    var is_new_date_price = true;
    //                    if( price_history.length == 0){
    //                    }else{
    //                        for( var d in price_history ){
    //                            dd = price_history[d];
    //                            if( dd['date'] ==  PARSER.currentDate() ){
    //                                is_new_date_price = false;
    //                                price_history[d]['date'] = PARSER.currentDate();
    //                                price_history[d]['timestamp'] = PARSER.currentTimestamp();
    //                                price_history[d]['price'] = new_data.price*1;
    //                            }
    //                        }
    //                    }
    //                    if( is_new_date_price == true ){
    //                        price_history.push({
    //                            date: PARSER.currentDate(),
    //                            timestamp: PARSER.currentTimestamp(),
    //                            price: new_data.price*1
    //                        });
    //                    }
    //                    if (price_history.length > 30) {
    //                        price_history.shift();
    //                    }
    //                    if (price_log.length > 20) {
    //                        price_log.shift();
    //                    }
    //                }
    //                to_be_update_data = {
    //                    date_of_birth : PARSER.currentIsoDate(),
    //                    price : new_data.price,
    //                    price_history: price_history,
    //                    price_log : price_log,
    //                    updated: 1,
    //                    time: PARSER.currentTimestamp(),
    //                    time_pretty: PARSER.currentIsoDate(),
    //                    date: PARSER.currentDate(),
    //                };
    //                console.log("\n");
    //                console.log('Going To Update');
    //                console.log( to_be_update_data );
    //                conn_website_scrap_data.update(where,{'$set' : to_be_update_data}, function (err, res) {
    //                    if( err ){
    //                        callback('Products Updated');
    //                        return true;
    //                    }else{
    //                        update_scrap_stats( u_rec_id, 'update', function( aa ){
    //                            console.log('1 UPdated :: '+aa);
    //                            callback('Products Updated');
    //                            return true;
    //                        });
    //                    }
    //                });
    //            }
    //        }
    //    })
}

function insert_or_update_products(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, scraped_products, callback) {

    console.log("---------------------------------------------------------------------Products Remaining For Insert & Update  :: " + scraped_products.length);
    if (scraped_products.length == 0) {
        callback('0 Scrapped Products Remaining Hence Callback Called');
        return true;
    } else {
        product = scraped_products[0];

        scraped_products.splice(0, 1); //remove first product
        add_update_product(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, product, function(info) {
            console.log(info);
            console.log('\n');
            console.log('\n');
            insert_or_update_products(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, scraped_products, callback);
        })
    }
}



function process_pagination_urls(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, urls, count_process, callback) {

    console.log("-------------------------------------------------------------------------------------------------------------------------------");
    console.log("---------------------------------------------------------------------STEP :: Start Processing Pagination Urls ");
    console.log("---------------------------------------------------------------------website ::  " + website);
    console.log("---------------------------------------------------------------------website_category ::  " + website_category);
    console.log("---------------------------------------------------------------------Pending Pagination Urls :: " + urls.length);

    console.log("---------------------------------------------------------------------At A Time Pagination Urls Process Count:: " + count_process);
    console.log(urls);

    console.log("\n");
    console.log("\n");
    console.log('Waiting Time : 10 Seconds....................');
    console.log("\n");
    console.log("\n");
    GENERIC.wait(10000);



    if (urls.length == 0) {
        callback('0  pagination urls remains hence callback called');
        return true;
    } else {
        var page_urls = [];
        _.each(urls, function(u, key) {
            if (page_urls.length < count_process) {
                page_urls.push(u);
                urls.splice(key, 1);
            }
        })
        if (page_urls.length > 0) {
            console.log("-------------------------------------------------------------------------------------------------------------------------------");
            _.each(page_urls, function(u1, key1) {
                console.log('SCRAPING  URL :: ' + u1);
                console.log("-------------------------------------------------------------------------------------------------------------------------------");
                scraper_master_website = get_website_scraper_object(website);
                scraper_master_website.get_page_products(u1, function(res_type, res_data) {
                    console.log("---------------------------------------------------------------------Scraping Status : " + res_type);
                    if (res_type == 'error') {
                        console.log("---------------------------------------------------------------------As Error Occurs Calling Recursivley");
                        process_pagination_urls(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, urls, count_process, callback);
                    } else {
                        console.log("---------------------------------------------------------------------Count products scraped :: " + res_data.length);
                        if (res_data.length > 0) {
                            console.log("---------------------------------------------------------------------Going to Insert Or Update Scraped Products");
                            insert_or_update_products(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, res_data, function() {
                                process_pagination_urls(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, urls, count_process, callback);
                            });
                            ///i am stucked here 
                            //                            _.each( res_data, function( u2 ){
                            //                                add_update_product( u_rec_id, website, website_category, u2, function(){
                            //                                    
                            //                                });
                            //                            })
                        } else {
                            process_pagination_urls(u_rec_id, website, website_category, u_cat_id, u_sub_cat_id, urls, count_process, callback);
                        }
                    }
                })
            })
        }
    }
}

function start_scrapping(pending_catalog_urls) {
    // this will process one catalog url at a time and multiple pagination urls if found for the catalog url
    console.log('#######################################################################################################');
    console.log('#######################################################################################################');

    console.log("---------------------------------------------------------------------START :: start_scrapping ");
    console.log("-------------------------------------------------------------------------------------------------------------------------------------------------------------------PENDING CATALOG URLS :: " + pending_catalog_urls.length);
    if (pending_catalog_urls.length == 0) {
        console.log('*************************************************************************');
        console.log('ALL URLS ARE PROCESSED ------ Going to start scrapping again ');
        console.log('*************************************************************************');


        unwantedProduct(60, 5, function(response_msg, response_data) {
            if (response_msg == 'error') {
                console.log(response_data);
                initiateScrapping();
            } else {
                console.log(response_msg, response_data);
                initiateScrapping();
            }
        });
        //process.exit(0);
    } else {
        var to_be_scrap = false;
        //if( typeof pending_catalog_urls[0] != 'undefined' ){
        to_be_scrap = pending_catalog_urls[0];
        pending_catalog_urls.splice(0, 1); // remove the url from pending_catalog_urls list
        //}
        if (to_be_scrap == false) {} else {
            console.log("---------------------------------------------------------------------Pending url going to process is below ");
            var u_url = to_be_scrap.get('url');
            var u_website = to_be_scrap.get('website');
            var u_website_category = to_be_scrap.get('url_text');
            var u_rec_id = to_be_scrap.get('_id');
            var u_cat_id = to_be_scrap.get('cat_id');
            var u_sub_cat_id = to_be_scrap.get('sub_cat_id');
            if (!u_cat_id) {
                u_cat_id = '';
            }
            if (!u_sub_cat_id) {
                u_sub_cat_id = '';
            }
            update_scrap_stats(u_rec_id, 'scrap_start', function(aa) {
                console.log('to_be_scrap u_url : ' + u_url);
                console.log('to_be_scrap u_website : ' + u_website);
                console.log('to_be_scrap u_website_category : ' + u_website_category);
                console.log('u_rec_id : ' + u_rec_id);
                console.log("-------------------------------------------------------------------------------------------------------------------------------");
                console.log("---------------------------------------------------------------------STEP :: Analysing Catalog Url Response");

                scraper_master_website = get_website_scraper_object(u_website);
                scraper_master_website.analyse_catalog_url(1, u_url, u_website_category, jquery_path, function(response_type, response_data) {
                    if (response_type == 'error') {
                        console.log("---------------------------------------------------------------------ERROR OCCURS");
                        start_scrapping(pending_catalog_urls);
                    } else {
                        console.log("---------------------------------------------------------------------SUCCESS OCCURS");
                        pagination_urls = response_data.pagination_urls;
                        console.log("---------------------------------------------------------------------Pagination Urls Found :: " + pagination_urls.length);
                        if (CONFIG_scrap_number_of_pagination != 0) {
                            pagination_urls = _.first(pagination_urls, CONFIG_scrap_number_of_pagination); // number of pagination pages to scrap products
                        }
                        console.log("---------------------------------------------------------------------Pagination Urls Will Be Processed :: " + pagination_urls.length);
                        if (pagination_urls.length > 0) {
                            process_pagination_urls(u_rec_id, u_website, u_website_category, u_cat_id, u_sub_cat_id, pagination_urls, CONFIG_scrap_pages_at_a_time, function(data) {
                                console.log(data);
                                //console.log('>>>>');
                                //process.exit(0);
                                start_scrapping(pending_catalog_urls);
                            });
                        } else {
                            start_scrapping(pending_catalog_urls);
                        }
                    }
                })
            });
        }
    }
}



//----SCRIPT STARTING POINT--------------------------------------------


function initiateScrapping() {
    //    w = {
    //        '_id' : '5694e413c23429483522b03c'
    //    } 
    w = {
        'website': MASTER_WEBSITE,
        '$or': [
            { 'scrap_status': 0 },
            { 'scrap_status': { '$exists': false } },
        ]
    }
    conn_catalog_urls.find(w, function(err, urls) {
        if (typeof urls == 'undefined' || urls.length == 0) {
            console.log('no urls found------ reseting all urls');
            conn_catalog_urls.update({
                'website': MASTER_WEBSITE,
            }, {
                $set: { 'scrap_status': 0 }
            }, {
                multi: true
            }, function(err, res) {
                if (err) {} else {
                    initiateScrapping();
                    console.log('update hua hau');
                }
            });
        } else {
            //urls = _.first( urls , 5);        
            start_scrapping(urls);
        }
    })
}

function unwantedProduct(days, no_of_times, callback) {
    var myNegInt = Math.abs(days) * (-1);
    var last_date = moment().add(myNegInt, 'days').unix();
    if (days && no_of_times) {
        pg_scrap_db2_website_scrap_data.remove({ $where: "this.price_log && this.price_log.length <= " + no_of_times + "", "price_history.timestamp": { $lte: last_date } }, function(err, products) {
            if (err) {
                callback("error", err);
            } else {
                if (products.result.ok === 1) {
                    callback('success', 'Total no of products removed is ' + products.result.n);
                }
            }
        });
    } else {
        callback("error", 'days and no_of_times cannot be empty');
    }
}

function token_encode(payload, secret, callback) {
    if (payload && secret) {
        //encode
        var token = jwt.encode(payload, secret);
        callback(token);
    } else {
        callback('');
    }
};

initiateScrapping();


module.exports = router;
