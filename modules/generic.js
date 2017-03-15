var urlMod = require('url');
var querystring = require('querystring');
module.exports = {
    wait: function (ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    },
    stringToArray: function (str, expby) {
        var ret = new Array();
        var split = str.split(expby);
        for (i = 0; i < split.length; i++) {
            ss = split[i];
            ss = ss.trim();
            if (ss.length > 0) {
                ret.push(ss);
            }
        }
        return ret;
    },
    getWebsiteWeight: function (website, cat_id, priority) {
        var web_weight = {
            'Flipkart': 1.1,
            'myntra': 1.2,
            'amazon': 1.3,
            'Snapdeal': 1.4,
            'jabong': 1.5,
            'fashionara': 1.6,
            'shoppersstop': 1.7,
            'trendin': 1.8,
            'koovs': 1.9,
            'yepme': 2,
            'zovi': 2.1,
            'paytm': 2.2,
            'basicslife': 2.3,
            'bewakoof': 2.4,
            'shopnineteen': 2.5,
            'moodsofcloe': 2.6,
            'zivame': 2.7,
            'prettysecrets': 2.8,
            'fabfurnish': 2.9,
            'zansaar': 3,
            'urbanladder': 3.1,
            'pepperfry': 3.2,
            'indiacircus': 1,
            'forever21': 1,
            'fabindia': 1,
            'zara': 1,
            'bata': 3.7,
            'miracas': 3.8,
            'faballey': 1,
            'elitify': 1,
            'indianroots': 1,
            'jaypore': 1
        };
        if (web_weight[website]) {
            return web_weight[website] * priority;
        } else {
            return 23 * priority;
        }

    },
    getFlipkartApiPrimaryURLMap: function (key) {
        var map = {};
        map["bags_wallets_belts"] = 3014;
        map["fragrances"] = 1107;
        map["tv_video_accessories"] = 16;
        map["camera_accessories"] = 13;
        map["sports_fitness"] = "";
        map["mobile_accessories"] = 12;
        map["software"] = 603;
        map["home_and_kitchen_needs"] = new Array(10, 18);
        map["televisions"] = 3;
        map["computer_storage"] = 6;
        map["mens_clothing"] = 30;
        map["stationery_office_supplies"] = "";
        map["video_players"] = 1603;
        map["tablets"] = 2;
        map["kids_footwear"] = new Array(48, 59);
        map["home_decor_and_festive_needs"] = 61;
        map["sunglasses"] = new Array(41, 53);
        map["womens_clothing"] = 50;
        map["kids_clothing"] = new Array(31, 58);
        map["womens_footwear"] = 52;
        map["air_coolers"] = "";
        map["desktops"] = 501;
        map["gaming"] = 4;
        map["microwave_ovens"] = 1004;
        map["laptop_accessories"] = "";
        map["tablet_accessories"] = "";
        map["mobiles"] = 1;
        map["grooming_beauty_wellness"] = 11;
        map["kitchen_appliances"] = 18;
        map["watches"] = new Array(43, 55);
        map["cameras"] = 7;
        map["home_improvement_tools"] = "";
        map["network_components"] = 611;
        map["laptops"] = 5;
        map["luggage_travel"] = "";
        map["refrigerator"] = 1003;
        map["home_entertainment"] = 16;
        map["air_conditioners"] = 1001;
        map["computer_peripherals"] = 6;
        map["audio_players"] = 1604;
        map["home_furnishing"] = 60;
        map["baby_care"] = 21;
        map["toys"] = 22;
        map["home_appliances"] = 10;
        map["computer_components"] = 20;
        map["washing_machine"] = 1002;
        map["mens_footwear"] = 40;

        return map[key];
    },
    getTextBetween: function (start, end, string) {
        var start_pos = string.indexOf(start) + start.length;
        var end_pos = string.indexOf(end, start_pos);
        var text_to_get = string.substring(start_pos, end_pos)
        return text_to_get;
    },
    getBracketText: function (string) {
        var ret = '';
        var Exp = /\((.*?)+\)/i;
        tt = string.match(Exp);
        if (tt != false && tt != null) {
            match = tt[0];
            ret = match.replace('(', '');
            ret = ret.replace(')', '');
            ret = ret.trim();
        }
        return ret;
    },
    getCleanNumber: function (price) {
        price = price.toString();
        if (price && price != '' && price != null) {
            price = price.replace(/[^\d.]/g, '');
            if (price.indexOf('.') == 0) {
                price = price.replace('.', '');
            }
            if (price.match(/\..*\./) && !price.match(/\s/)) {
                var price = price.replace(".", "");
            }
        }
        return price;
    },
    manipulateRating: function (type, rating) {
        var ret = 0;
        if (type == '%') {
            ret = rating / 10;
        } else if (type == '10') {
            ret = rating;
        } else if (type == '5') {
            ret = rating * 2;
        }
        return ret;
    },
    isNumeric: function (string) {
        if (typeof string == 'undefined') {
            return false;
        }
        var Exp = /((^[0-9]+)|(^[0-9]+))+[0-9]+$/i;
        if (!string.match(Exp)) {
            return false;
        } else {
            return true;
        }
    },
    isAlphaNumeric: function (string) {
        //var Exp = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
        var Exp = /((^[0-9-]+[a-z-]+)|(^[a-z-]+[0-9-]+))+[0-9a-z-]*$/i;
        if (!string.match(Exp)) {
            return false;
        } else {
            return true;
        }
    },
    isAlpha: function (string) {
        var Exp = /((^[a-z]+)|(^[a-z]+))+[a-z]+$/i;
        if (!string.match(Exp)) {
            return false;
        } else {
            return true;
        }
    },
    getCatStandSizes: function (dbApprovedSizes, cat_id, sub_cat_id) {
        var s_sizes = new Array();
        dbApprovedSizes.forEach(function (kk) {
            curr_cat_id = kk['cat_id'];
            curr_main_size = kk['main_size'];
            curr_look_alikes = kk['look_alikes'];
            if (curr_cat_id == cat_id) {
                s_sizes[curr_main_size] = curr_look_alikes;
            }
        });
        /*
         if(cat_id == 30) {
         s_sizes['38'] = new Array('XS');
         s_sizes['39'] = new Array('S');
         s_sizes['40'] = new Array('M');
         s_sizes['42'] = new Array('L');
         s_sizes['44'] = new Array('XL');
         s_sizes['46'] = new Array('XXL');
         s_sizes['48'] = new Array('3XL');
         s_sizes['50'] = new Array('4XL');
         s_sizes['52'] = new Array('5XL');
         s_sizes['54'] = new Array('6XL');
         }
         */
        return s_sizes;
    },
    getStandardSizes: function (dbApprovedSizes, sizes, cat_id, sub_cat_id) { // sizes is an array
        var s_sizes = new Array();
        s_sizes = this.getCatStandSizes(dbApprovedSizes, cat_id, sub_cat_id);
        if (s_sizes.length > 0) {
            var ret_sizes = new Array();
            if (sizes.length > 0) {
                for (var i = 0; i < sizes.length; i++) {
                    cur_size = sizes[i].trim();
                    found_size = '';
                    Object.keys(s_sizes).forEach(function (key_size) {
                        if (cur_size == key_size) {
                            found_size = key_size;
                        } else {
                            chk_sizes = s_sizes[key_size];
                            for (var k = 0; k < chk_sizes.length; k++) {
                                if (cur_size == chk_sizes[k]) {
                                    found_size = key_size;
                                    break;
                                }
                            }
                        }
                    });
                    if (found_size != '') {
                        if (ret_sizes.indexOf(found_size) == -1) {
                            ret_sizes.push(found_size);
                        }
                    } else {
                        console.log(' ALERT :: new size found. -- ' + cur_size);
                        ret_sizes.push(cur_size);
                        //process.exit(0);
                    }
                }
            }
            return ret_sizes;
        } else {
            return sizes;
        }
    },
    arrayToString: function (arr, impby) {
        return arr.join(impby);
    },
    getUniqueCode: function (website, url) {
        website = website.toLowerCase();
        if (website == 'zivame') {
            url = this.getPath(url);
            url = this.getLastSlash(url);
            url = url.replace('.html', '');
            return url;
        }
        if (website == 'koovs') {
            var d = urlMod.parse(url);
            d = querystring.parse(d['query']);
            return d.skuid;
        }
        if (website == 'zovi') {
            url = this.getLastSlash(url);
            url = url.split('--');
            return url[url.length - 1];
        }
        if (website == 'yepme') {
            var d = urlMod.parse(url);
            d = querystring.parse(d['query']);
            return d.CampId;
        }
        if (website == 'basicslife') {
            url = this.getPath(url);
            url = this.getLastSlash(url);
            url = url.replace('.html', '');
            url = url.split('-');
            return url[url.length - 1];
        }
        if (website == 'fashionara') {
            url = this.getPath(url);
            url = this.getLastSlash(url);
            url = url.replace('.html', '');
            return url;
        }
        if (website == 'myntra') {
            url = this.getPath(url);
            url = url.replace('/buy', '');
            return this.getLastSlash(url);
        }
        if (website == 'sargam') {
            url = this.getPath(url);
            return this.getLastSlash(url);
        }
        if (website == 'vijaysales') {
            url = this.getPath(url);
            return this.getLastSlash(url);
        }
        if (website == 'safetykart') {
            url = this.getPath(url);
            return this.getLastDash(url);
        }
        if (website == 'grabmore') {
            url = this.getPath(url);
            return this.getSlashNextParam(url, 'products');
        }
        if (website == 'jabong') {
            url = this.getPath(url);
            return this.getLastDash(url);
        }
        if (website == 'littleshop' || website == 'mybabycart') {
            url = this.getPath(url);
            return this.getFirstDash(url);
        }
        if (website == 'firstcry') {
            var url1 = this.getPath(url);
            x = this.getSlashPrevParam(url1, 'product-detail');
            if (!x) {
                url = urlMod.parse(url);
                var query = url.query;
                query = query.split('&');
                for (var i = 0; i < query.length; i++) {
                    q = query[i];
                    q = q.split('-');
                    if (q[0] == 'proid') {
                        return q[1];
                    }
                }
            } else {
                return x;
            }
        }
        if (website == 'babyoye') {
            url = this.getPath(url);
            return this.getLastUnderscore(url);
        }
        if (website == 'ezoneonline') {
            url = this.getPath(url);
            return this.getLastDash(url);
        }
        if (website == 'themobilestore') {
            var pid = '';
            if (url.indexOf('#variant_id') != -1) {
                url = urlMod.parse(url);
                var query = url.hash;
                query = query.split('&');
                var pid = '';
                for (var i = 0; i < query.length; i++) {
                    q = query[i];
                    q = q.split('-');
                    if (q[0] == 'variant_id') {
                        pid = '-' + q[1];
                    }
                }
            }
            url = this.getPath(url);
            return this.getLastSlash(url) + pid;
        }
        if (website == 'infibeam') {
            var pid = '';
            if (url.indexOf('#variantId') != -1) {
                url = urlMod.parse(url);
                var query = url.hash;
                query = query.split('&');
                var pid = '';
                for (var i = 0; i < query.length; i++) {
                    q = query[i];
                    q = q.split('-');
                    if (q[0] == 'variantId') {
                        pid = '-' + q[1];
                    }
                }
            }
            url = this.getPath(url);
            return this.getLastSlash(url) + pid;
        }
        if (website == 'beautykafe' || website == 'snapittoday' || website == 'redlily' || website == 'medplusbeauty' || website == 'purplle' || website == 'nykaa' || website == 'snapdeal' || website == 'crossword' || website == 'rediff' || website == 'uread' || website == 'naaptol' || website == 'bagittoday' || website == 'letshop' || website == 'edabba' || website == 'royalimages' || website == 'onemi' || website == 'suzalin' || website == 'giffiks' || website == 'kaunsa' || website == 'healthgenie' || website == 'ibhejo' || website == 'dailyobjects' || website == 'reliance' || website == 'egully' || website == 'pepperfry' || website == 'maniacstore') {
            url = this.getPath(url);
            return this.getLastSlash(url);
        }
        if (website == 'next') {
            url = this.getPath(url);
            return this.getSlashNextParam(url, 'product');
        }
        if (website == 'shopbychoice') {
            url = this.getPath(url);
            url = url.split('/');
            return url[url.length - 2];
        }
        if (website == 'ezeekart') {
            url = this.getPath(url);
            return this.getSlashNextParam(url, 'products');
        }
        if (website == 'mirchimart') {
            var urls = url.split(';');
            url = urls[0];
            url = this.getPath(url);
            return this.getSlashNextParam(url, 'p');
        }
        if (website == 'adexmart') {
            url = this.getPath(url);
            url = this.getLastSlash(url);
            url = url.split('-');
            return url[0];
        }
        if (website == 'yebhi') {
            url = this.getPath(url);
            return this.getSlashPrevParam(url, 'PD');
        }
        if (website == 'bookadda') {
            url = this.getPath(url);
            url = this.getLastSlash(url);
            url = url.split('-');
            return url[url.length - 1];
        }
        if (website == 'ebay' || website == 'ebayapi') {
            url = this.getPath(url);
            if (url.indexOf('pdt') != -1) {
                url = url.split('/');
                return url[url.length - 1];
            } else if (url.indexOf('itm') != -1) {
                return this.getSlashNextParam(url, 'itm');
            }
        }
        if (website == 'croma') {
            url = this.getPath(url);
            url = this.getLastSlash(url);
            url = url.split('-');
            return url[url.length - 1] + '-' + url[url.length - 2];
        }
        if (website == 'homeshop') {
            url = this.getPath(url);
            url = url.split('/');
            for (var i = 0; url.length; i++) {
                var u = url[i];
                if (u.length > 0) {
                    if (u.indexOf('product:') != -1) {
                        return u.replace('product:', '');
                    }
                }
            }
            return false;
        } else if (website == 'amazon') {
            url = this.getPath(url);
            var x = this.getSlashNextParam(url, 'dp');
            if (!x) {
                x = this.getSlashNextParam(url, 'product');
            }
            return x;
        } else if (website == 'flipkart' || website == 'flipkart_new') {
            url = urlMod.parse(url);
            var query = url.query;
            pid = '';
            if (query) {
                query = query.split('&');
                var pid = '';
                for (var i = 0; i < query.length; i++) {
                    q = query[i];
                    q = q.split('=');
                    if (q[0] == 'pid') {
                        pid = q[1];
                    }
                }
            }
            url = this.getPath(url);
            return this.getSlashNextParam(url, 'p') + "-" + pid;
        } else if (website == 'shopclues') {
            url = this.getPath(url);
            return this.getLastSlash(url);
        } else if (website == 'tradus') {
            url = this.getPath(url);
            return this.getSlashNextParam(url, 'p');
        } else if (website == 'indiatimes') {
            url = this.getPath(url);
            url = this.getLastSlash(url);
            if (url.indexOf('p_') != -1) {
                var x = url.replace('p_', '');
                return x;
            }
        } else if (website == 'zoomin') {
            url = this.getPath(url);
            return this.getLastSlash(url);
        } else if (website == 'landmark') {
            if (url.indexOf('http') != -1) {
                url = this.getPath(url);
                return this.getLastSlash(url);
            } else {
                url = url.replace(/\//, '');
                return url;
            }
        } else if (website == 'saholic' || website == 'acadzone' || website == 'browsecart') {
            url = this.getPath(url);
            return this.getLastDash(url);
        }
        if (website == 'greendust') {
            if (url.indexOf('products_id') != -1) {
                var pid = '';
                if (url.indexOf('?id') != -1) {
                    url = urlMod.parse(url);
                    var query = url.query;
                    query = query.split('&');
                    var pid = '';
                    for (var i = 0; i < query.length; i++) {
                        q = query[i];
                        q = q.split('-');
                        if (q[0] == 'products_id') {
                            return q[1];
                        }
                    }
                }
            } else {
                url = this.getPath(url);
                return this.getLastSlash(url);
            }
        } else if (website == 'healthkart') {
            url = urlMod.parse(url);
            var query = url.query;
            if (query && typeof query == "undefined") {
                return "";
            } else {
                query = query.split('&');
                var pid = '';
                for (var i = 0; i < query.length; i++) {
                    var q = query[i];
                    q = q.split('-');
                    if (q[0] == 'navKey') {
                        pid = q[1];
                    }
                }
                url = this.getPath(url);
                return this.getLastDash(url) + "-" + pid;
            }
        } else if (website == 'forever21') {
            url = urlMod.parse(url);
            var query = url.query;
            pid = '';
            if (query) {
                query = query.split('&');
                var pid = '';
                for (var i = 0; i < query.length; i++) {
                    q = query[i];
                    q = q.split('=');
                    if (q[0] == 'ProductID') {
                        pid = q[1];
                    }
                }
            }
            return pid;
        }
        url = this.getPath(url);
        return this.getLastSlash(url);
    },
    getPath: function (url) {
        if (typeof url == "undefined" || !url)
            return;
        url = urlMod.parse(url);
        return url.pathname;
    },
    getLastUnderscore: function (url) {
        if (typeof url == "undefined" || !url)
            return;
        url = this.getLastSlash(url);
        org_url = url;
        url = url.split('-');
        url = url[url.length - 1];
        var intRegex = /^\d+$/;
        if (intRegex.test(url)) {
            return url;
        } else {
            return org_url;
        }
    },
    getFirstDash: function (url) {
        if (typeof url == "undefined" || !url)
            return;
        url = this.getLastSlash(url);
        org_url = url;
        url = url.split('-');
        url = url[0];
        var intRegex = /^\d+$/;
        if (intRegex.test(url)) {
            return url;
        } else {
            return org_url;
        }
    },
    getLastDash: function (url) {
        if (typeof url == "undefined" || !url)
            return;
        url = this.getLastSlash(url);
        org_url = url;
        url = url.split('-');
        url = url[url.length - 1];
        url = url.replace('.html', '');
        url = url.replace('.php', '');
        url = url.replace('.asp', '');
        url = url.replace('.aspx', '');
        url = url.replace('.xhtml', '');
        var intRegex = /^\d+$/;
        if (intRegex.test(url)) {
            return url;
        } else {
            return org_url;
        }
    },
    getLastSlash: function (url) {
        if (typeof url == "undefined" || !url)
            return;
        url = url.split('/');
        url = url[url.length - 1];
        return url;
    },
    getSlashPrevParam: function (url, p) {
        if (typeof url == "undefined" || !url)
            return;
        url = url.split('/');
        var i = 0;
        for (i = 0; i < url.length; i++) {
            var u = url[i];
            if (u == p) {
                if (typeof url[i - 1] != "undefined")
                    return url[i - 1];
            }
        }
        return false;
    },
    getSlashNextParam: function (url, p) {
        if (typeof url == "undefined" || !url) {
            return '';
        }
        url = url.split('?');
        url = url[0].split('/');
        var i = 0;
        for (i = 0; i < url.length; i++) {
            var u = url[i];
            if (u == p) {
                if (typeof url[i + 1] != "undefined")
                    return url[i + 1];
            }
        }
        return false;
    },
    getAffiliateUrl: function (website, url) {
        aff_url = 'http://linksredirect.com?pub_id=2491CL2376&url=' + encodeURIComponent(url);
        return aff_url;
    },
};