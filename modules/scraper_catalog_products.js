var generic_function = require('./generic');
var fs = require('fs');
var scrap_catalog = {
    getUnique: function (website, div) {
        ret = '';
        if (website.indexOf('shopclues') != -1) {
            if (div.find('a').attr('pid') != 'undefined') {
                ret = div.find('a').attr('pid');
            }
        } else if (website.indexOf('amazon') != -1) {
            if (typeof div.attr('data-asin') != 'undefined') {
                unique = div.attr('data-asin');
                ret = unique.trim();
            }
        }
        return ret;
    },
    getSortScoreManipulateData: function (website, div) {
        var ret = '';
        if (website.indexOf('amazon') != -1) {
            if (div.find('span.rankNumber').length > 0) {
                ret = div.find('span.rankNumber').text();
            }
        }
        ret = ret.trim();
        return ret;
    },
    getName: function (website, div) {
        var ret_name = '';
        if (website.indexOf('shopclues') != -1) {
            if (typeof div.find('img').attr('title') != 'undefined') {
                ret_name = div.find('img').attr('title');
            }
        } else if (website.indexOf('paytm') != -1) {
            if (typeof div['name'] != 'undefined' && div['name'] != '') {
                ret_name = div['name'];
            }
        } else if (website.indexOf('exclusively') != -1) {
            ret_name = div.find('h3.product-name').find('a').attr('title');
        } else if (website.indexOf('elitify') != -1) {
            ret_name = div.find('.info').find('span.title').text();
        } else if (website.indexOf('ezeekart') != -1) {
            ret_name = div.find('.product_link_style').eq(1).children('a').text();
        } else if (website.indexOf('egully') != -1) {
            ret_name = div.parent().find('.ProductDetails').text();
        } else if (website.indexOf('jabong') != -1) {
            ret_name = div.find('span.qa-brandName').text().trim() + ' ' + div.find('span.qa-brandTitle').text().trim();
        } else if (website.indexOf('rediff') != -1) {
            if (div.parent().find('a[urlAlt=browse]').length > 0) {
                ret_name = div.parent().find('a[urlAlt=browse]').text();
            } else {
                ret_name = div.parent().find('.fntsm1').first().text();
            }
        } else if (website.indexOf('snapittoday') != -1) {
            ret_name = div.parent().children('.namecont').children('div').last().text();
        } else if (website.indexOf('purplle') != -1) {
            ret_name = div.find('.product-detail').children('.product-name').text();
        } else if (website.indexOf('landmarkonthenet') != -1) {
            ret_name = div.find('img').attr('alt');
        } else if (website.indexOf('myntra') != -1) {
            brand = div.find('div.brand').text();
            name = div.find('div.product').text();
            ret_name = brand + ' ' + name;
        } else if (website.indexOf('snapdeal') != -1 || website.indexOf('Snapdeal') != -1) {
            if (div.find('p.product-title').length > 0) {
                ret_name = div.find('p.product-title').text();
            }
        } else if (website.indexOf('zovi') != -1) {
            ret_name = div.find('.title').text();
        } else if (website.indexOf('fashionara') != -1) {
            bb = div.find('p.brand').text().trim();
            ret_name = bb + ' ' + div.find('h2.product-name').text().trim();
        } else if (website.indexOf('amazon') != -1) {
            if (div.find('.newaps').find('span.lrg').length > 0) {
                ret_name = div.find('.newaps').find('span.lrg').text();
            }
            if (div.find('a.s-access-detail-page').length > 0) {
                ret_name = div.find('a.s-access-detail-page').attr('title');
            }
        } else if (website.indexOf('bewakoof') != -1) {
            ret_name = div.find('.save_for_later_main').attr('data-pname');
        } else if (website.indexOf('yepme') != -1) {
            ret_name = div.find('img.prod_Itm_img').attr('alt');
        } else if (website.indexOf('moodsofcloe') != -1) {
            if (div.find('img.loading_img').length > 0) {
                ret_name = div.find('img.loading_img').attr('title')
            }
        } else if (website.indexOf('zivame') != -1) {
            ret_name = div.find('.prd_a').find('img.brand_img').attr('alt');
        } else if (website.indexOf('prettysecrets') != -1) {
            name = div.find('a.product-name').attr('alt');
            name = name.replace("online", "");
            name = name.replace("Online", "");
            name = name.replace("Buy", "");
            name = name.replace("buy", "");
            ret_name = name.trim();
        } else if (website.indexOf('shopnineteen') != -1) {
            ret_name = div.find('h2.product-name').find('a').text();
        } else if (website.indexOf('koovs') != -1) {
            ret_name = div.find('img.productImage').attr('title');

        } else if (website.indexOf('fabfurnish') != -1) {
            ret_name = div.find('a.itm-link').attr('title');
        } else if (website.indexOf('shoppersstop') != -1) {
            ret_name = div.find('a.product-image').attr('title');
        } else if (website.indexOf('indiacircus') != -1) {
            ret_name = div.find('h2.product-name').find('a').attr('title');
        } else if (website.indexOf('urbanladder') != -1) {
            if (div.find('a.product-img').children('img').length > 0) {
                ret_name = div.find('a.product-img').children('img').attr('title');
            }
            if (ret_name == '' && div.find('a.product-title').length > 0) {
                ret_name = div.find('a.product-title').attr('title');
            }
        } else if (website.indexOf('forever21') != -1) {
            ret_name = div.find('div.DisplayName').text();
        } else if (website.indexOf('Flipkart') != -1 || website.indexOf('flipkart') != -1) {
            if (div.productBaseInfoV1.title) {
                ret_name = div.productBaseInfoV1.title;
            }
        } else if (website.indexOf('fabindia') != -1) {
            ret_name = div.find('h2.product-name').text();
        } else if (website.indexOf('zara') != -1) {
            ret_name = div.find('img.product-img').attr('alt');
        } else if (website.indexOf('indianroots') != -1) {
            ret_name = div.find('div.product-details').find('a').attr('title');
        } else if (website.indexOf('bata') != -1) {
            ret_name = div.find('p.name').find('a').attr('title');
        } else if (website.indexOf('miracas') != -1) {
            ret_name = div.find('a.product_img_link').attr('title');
        } else if (website.indexOf('trendin') != -1) {
            if (div.find('p.text-center').find('span.brand_name').length > 0) {
                ret_name = div.find('p.text-center').find('span.brand_name').text();
                ret_name = ret_name.trim();
                div.find('p.text-center').find('span.brand_name').remove();
                ret_name = ret_name + div.find('p.text-center').find('span').text();
                ret_name = ret_name.trim();
            } else {
                ret_name = ret_name + div.find('p.text-center').text();
                ret_name = ret_name.trim();
            }
        }
        if (typeof ret_name != 'undefined' && ret_name.length > 0) {
            ret_name = ret_name.trim();
        }
        return ret_name;
    },
    getPriceText: function (website, div) {
        var return_price_text = '';
        if (website.indexOf('shopclues') != -1) {
            p_text = '';
            if (div.find('.p_price').length > 0) {
                p_text = div.find('.p_price').html();
                if (p_text.indexOf('-') != -1) {
                    explode = generic_function.stringToArray(p_text, '-');
                    if (explode.length > 0) {
                        p_text = explode[0];
                    }
                }
            }
            return_price_text = p_text;
        } else if (website.indexOf('paytm') != -1) {
            if (typeof div['offer_price'] != 'undefined' && div['offer_price'] != '') {
                return_price_text = div['offer_price'];
            }
            if (return_price_text == '' && typeof div['actual_price'] != 'undefined' && div['actual_price'] != '') {
                return_price_text = div['actual_price'];
            }
            return_price_text = return_price_text.toString();
        } else if (website.indexOf('snapdeal') != -1 || website.indexOf('Snapdeal') != -1) {
            if (div.find('div.product-price-row').find('span.product-price').length > 0) {
                return_price_text = div.find('div.product-price-row').find('span.product-price').text();
            }
        } else if (website.indexOf('perniaspopupshop') != -1) {
            if (div.find('span.price').length > 0) {
                return_price_text = div.find('span[itemprop="price"]').text();
            }
        } else if (website.indexOf('exclusively') != -1) {
            if (div.find('span[itemprop="price"]').length > 0) {
                return_price_text = div.find('span[itemprop="price"]').text();
            }
        } else if (website.indexOf('elitify') != -1) {
            if (div.find('div.info').find('span.money').length > 0) {
                return_price_text = div.find('div.info').find('span.money').eq(0).text();
            }
        } else if (website.indexOf('zara') != -1) {
            return_price_text = div.find('span.price').find('span').attr('data-ecirp');
        } else if (website.indexOf('ezeekart') != -1) {
            var text = '';
            div.children('.product_link_style').each(function (index) {
                if (index == 1)
                    text = $(this).text();
            });
            return_price_text = text;
        } else if (website.indexOf('mirchimart') != -1) {
            if (div.parent().parent().siblings('.txt').length > 0)
                return_price_text = div.parent().parent().siblings('.txt').first().find('.pPrice').first().text();
        } else if (website.indexOf('next.co.in') != -1) {
            return_price_text = div.closest('.ish-productTile').find('.kor-product-sale-price').children('.kor-product-sale-price-value').text();
        } else if (website.indexOf('shopbychoice') != -1) {
            return_price_text = div.closest('.category-product-wrapper').find('.category-product-detail').first().children('strong').text();
        } else if (website.indexOf('gadgetsguru') != -1) {
            return_price_text = div.parent().children('.hOrng').children('b').text();
        } else if (website.indexOf('browsecart') != -1) {
            return_price_text = div.parent().children('h2').find('[itemprop=price]').text();
        } else if (website.indexOf('jabong') != -1) {
            return_price_text = div.parent().children('.qa-prdprce').text();
        } else if (website.indexOf('infibeam') != -1) {
            if (div.find('.price').children('.normal').length > 0)
                return_price_text = div.find('.price').children('.normal').text();
            else
                return_price_text = div.find('.price').text();
        } else if (website.indexOf('rediff') != -1) {
            return_price_text = div.parent().children('.alignC').children('.bold').text();
        } else if (website.indexOf('cromaretail') != -1) {
            return_price_text = div.children('h3').text();
        } else if (website.indexOf('freekaamaal') != -1) {
            return_price_text = div.parent().children('.rrss').children('.rs1').text();
        } else if (website.indexOf('purplle') != -1) {
            return_price_text = div.find('.product-detail').children('.product-price').text();
        } else if (website.indexOf('ezoneonline') != -1) {
            div.find('.mj-prod-price').children('span').remove();
            return_price_text = div.find('.mj-prod-price').text();
        } else if (website.indexOf('landmarkonthenet') != -1) {
            if (div.find('.buttons').find('.pricelabel').length == 0) {
                return_price_text = "0";
            } else {
                div.find('.buttons').find('.pricelabel').children('span').remove();
                return_price_text = div.find('.buttons').find('.pricelabel').text();
            }
        } else if (website.indexOf('myntra') != -1) {
            strike = discount = '';
            if (div.find('span.strike').length > 0) {
                strike = div.find('span.strike').text();
            }
            if (div.find('span.discount').length > 0) {
                discount = div.find('span.discount').text();
            }
            pr = div.find('.price').text();
            pr = pr.replace(strike, '');
            pr = pr.replace(discount, '');
            return_price_text = pr;
        } else if (website.indexOf('zovi') != -1) {
            div.find('.details').find('span.WebRupee').remove();
            div.find('.details').find('span.old-price').remove();
            return_price_text = div.find('.details').find('label.visible').html();
        } else if (website.indexOf('amazon') != -1) {
            ul = div.find('ul.rsltGridList li:nth-child(1)');
            p_text = ul.find('span.red');
            p_text.find('.currencyINR').remove();
            p_text = p_text.text();
            p_text = p_text.trim();
            if (p_text == '') {
                p_text = div.find('span.s-price');
                p_text.find('.currencyINR').remove();
                p_text = p_text.text();
            }
            if (p_text.indexOf('-') != -1) {
                explode = generic_function.stringToArray(p_text, '-');
                if (explode.length > 0) {
                    p_text = explode[0];
                }
            }
            return_price_text = p_text;
        } else if (website.indexOf('yepme') != -1) {
            price = '';
            $(div.find('div')).each(function () {
                id = $(this).attr('id');
                if (id == 'PnOfferAndMarketEqual') {
                    price = $(this).find('span').text();
                    return price;
                } else if (id == 'PnOfferAndMarketNotEqual') {
                    price = $(this).find('span:nth-child(4)').text();
                    return price;
                }
            });
            return_price_text = price;
        } else if (website.indexOf('moodsofcloe') != -1) {
            chk_length = div.find('.floatL').find('.greyText2').children('span').length;
            if (chk_length == 1) {
                return_price_text = div.find('.floatL').find('.greyText2').children('span').text();
            } else if (chk_length == 2) {
                div.find('.floatL').find('.greyText2').children('span:first-child').remove();
                return_price_text = div.find('.floatL').find('.greyText2').children('span').text();
            }
        } else if (website.indexOf('indiacircus') != -1) {
            //if (div.find('div.price-box').find('span.price').length > 0) {
            // return_price_text =   div.find('div.price-box').find('span.price').text();
            //return_price_text = '$'+return_price_text;
            //}
            return_price_text = '$1';
        } else if (website.indexOf('urbanladder') != -1) {
            //if (div.find('a.pricing-link').find('span.pricing').length > 0) {
            //priceText = div.find('a.pricing-link').find('span.pricing').text();
            //priceText = priceText.replace('Starting from', '');
            //return_price_text =   priceText;
            //}
            if (div.find('.price').length > 0) {
                priceText = div.find('.price').text();
                return_price_text = priceText;
            }
        } else if (website.indexOf('basicslife') != -1) {
            if (div.find('.price-box').find('span.price').length > 0) {
                priceText = div.find('.price-box').find('span.price').text();
            }
            if (div.find('.price-box').find('p.special-price').find('span.price').length > 0) {
                priceText = div.find('.price-box').find('p.special-price').find('span.price').text();
            }
            return_price_text = priceText;
        } else if (website.indexOf('fabfurnish') != -1) {
            priceText = '';
            if (div.find('div.catItmPriceBox').find('span.itm-priceSpecialnew').length > 0) {
                priceText = div.find('div.catItmPriceBox').find('span.itm-priceSpecialnew').text();
            }
            if (div.find('div.catItmPriceBox_left').find('span.itm-priceSpecialnew').length > 0) {
                priceText = div.find('div.catItmPriceBox_left').find('span.itm-priceSpecialnew').text();
            }
            if (priceText == '' || priceText == 0) {
                if (div.find('div.catItmPriceBox_orange').find('span.itm-priceSpecialnew').length > 0) {
                    priceText = div.find('div.catItmPriceBox_orange').find('span.itm-priceSpecialnew').text();
                }
            }
            if (priceText == '' || priceText == 0) {
                if (div.find('font.price').length > 0) {
                    priceText = div.find('font.price').text();
                }
            }
            return_price_text = priceText;
        } else if (website.indexOf('forever21') != -1) {
            if (div.find('div.price-box').find('span.price').length > 0) {
                return_price_text = div.find('div.price-box').find('span.price').text();
            }
        } else if (website.indexOf('fabindia') != -1) {
            if (div.find('div.price-box').find('span.price').length > 0) {
                return_price_text = div.find('div.price-box').find('span.price').text();
            }
        } else if (website.indexOf('indianroots') != -1) {
            //if (div.find('div.price-box').find('span.price').length > 0) {
            // return_price_text =   div.find('div.price-box').find('span.price').text();
            //}
            return_price_text = '$1';
        } else if (website.indexOf('bata') != -1) {
            if (div.find('span.offer-price').find('span.changeCurr').length > 0) {
                p_text = div.find('span.offer-price').find('span.changeCurr').text();
                return_price_text = p_text;
            }
        } else if (website.indexOf('miracas') != -1) {
            if (div.find('span.price').length > 0) {
                p_text = div.find('span.price').text();
                return_price_text = p_text;
            }
        } else if (website.indexOf('Flipkart') != -1 || website.indexOf('flipkart') != -1) {
            if (div.productBaseInfoV1.flipkartSellingPrice.amount) {
                p_text = div.productBaseInfoV1.flipkartSellingPrice.amount;
                return_price_text = p_text;
            }
        } else if (website.indexOf('shoppersstop') != -1) {
            p_text = '';
            if (div.find('.price-box').find('span.special-price').length > 0) {
                p_text = div.find('price-box').find('span.special-price').text();
            }
            if (p_text.length == 0 && div.find('.price-box').find('span.regular-price').length > 0) {
                p_text = div.find('.price-box').find('span.regular-price').text();
            }
            if (p_text.length == 0 && div.find('.price-box').find('span.old-price').length > 0) {
                p_text = div.find('.price-box').find('span.old-price').text();
            }
            return_price_text = p_text;
        } else if (website.indexOf('trendin') != -1) {
            if (div.find('.off_price').length > 0) {
                p_text = div.find('.off_price').text();
                return_price_text = p_text;
                return_price_text = return_price_text.trim();
            }
        }
        // console.log(return_price_text)
        // if (return_price_text.indexOf('$') != -1) {
        //     return_price_text = '1';
        // }

        return_price_text = generic_function.getCleanNumber(return_price_text);

        return return_price_text;
    },
    getBrandName: function (website, div, name) {
        //console.log('website : '+ website);
        //console.log('name : '+ name);
        context = this;
        var brand = '';
        if (website.indexOf('elitify') != -1) {
            brand = div.find('.info').find('span.vendor').text();
        } else if (website.indexOf('fashionara') != -1) {
            if ($(div).find('p.brand').length > 0) {
                brand = $(div).find('p.brand').text().trim();
            }
        } else if (website.indexOf('yepme') != -1) {
            if (name.toLowerCase().indexOf('yepme') != -1) {
                brand = 'Yepme';
            }
        } else if (website.indexOf('zovi') != -1) {
            brand = 'Zovi';
        } else if (website.indexOf('freecultr') != -1) {
            brand = 'freecultr';
        } else if (website.indexOf('jabong') != -1) {
            if ($(div).find('span.title').length > 0) {
                brand = $(div).find('span.qa-brandName').text().trim();
            }
        } else if (website.indexOf('myntra') != -1) {
            if ($(div).find('div.brand').length > 0) {
                brand = $(div).find('div.brand').text().trim();
            }
        } else if (website.indexOf('fabindia') != -1) {
            brand = 'Fabindia';
        } else if (website.indexOf('zara') != -1) {
            brand = 'Zara';
        }
        brand = brand.trim();
//        if (brand == '' && context.globalAllBrands.length > 0) {
//            allBrands = context.globalAllBrands
//            for (i = 0; i < allBrands.length; i++) {
//                bbb = allBrands[i];
//                if (bbb.length > 2) {
//                    var filter = new RegExp(bbb)
//                    match = name.match(filter);
//                    if (match != null) {
//                        brand = bbb;
//                        break;
//                    }
//                }
//            }
//        }
        return brand;
    },
    getImage: function (website, div) {
        var ret = '';
        if (website.indexOf('shopclues') != -1) {
            if (div.find('img').attr('data-img')) {
                ret = div.find('img').attr('data-img');
            }
            // if( div.find('img').length ){
            //     ret = div.find('img').attr('src2');
            // }
        } else if (website.indexOf('paytm') != -1) {
            if (typeof div['image_url'] != 'undefined' && div['image_url'] != '') {
                ret = div['image_url'];
            }
        } else if (website.indexOf('amazon') != -1) {
            if (div.find('img.s-access-image').length) {
                ret = div.find('img.s-access-image').attr('src');
            }
        } else if (website.indexOf('snapdeal') != -1 || website.indexOf('Snapdeal') != -1) {
            if (div.find('img.product-image').length > 0) {
                ret = div.find('img.product-image').attr('src');
                if (typeof ret == 'undefined' || ret == '') {
                    ret = div.find('source').attr('srcset');
                }
                if (typeof ret == 'undefined' || ret == '') {
                    ret = div.find('img.product-image').attr('lazySrc');
                }
                if (typeof ret == 'undefined' || ret == '') {
                    ret = div.find('img.product-image').attr('lazysrc');
                }
                if (typeof ret == 'undefined' || ret == '') {
                    img_url = div.find('input').val();
                    ret = img_url.replace("64x75", "large");
                }
            }
            //ret = div.find('img.gridViewImage').attr('src');
        } else if (website.indexOf('fabindia') != -1) {
            ret = div.find('a.product-image').find('img').attr('src');
        } else if (website.indexOf('giffiks') != -1) {
            var h = div.children('.product_name').first().attr('href');
            if (to_log)
                console.log('h in gifficks' + h);
            if (typeof h != "undefined") {
                h = h.substring(h.lastIndexOf('/') + 1, h.length);
                ret = 'http://www.giffiks.com/images/mobiles/' + h + '/size2/size2_1.jpg';
            }
        } else if (website.indexOf('next.co.in') != -1) {
            var alt = img.attr('alt');
            if (typeof alt != "undefined") {
                alt = "http://next.co.in" + alt.replace(/&#47;/g, '/');
                ret = alt;
            }
        } else if (website.indexOf('bewakoof') != -1) {
            ret = div.find('#main_image').attr('data-original');
        } else if (website.indexOf('bewakoof') != -1) {
            ret = div.find('#main_image').attr('data-original');
        } else if (website.indexOf('yepme') != -1) {
            ret = div.find('img.prod_Itm_img').attr('data-original');
        } else if (website.indexOf('moodsofcloe') != -1) {
            ret = div.find('img.loading_img').attr('src');
        } else if (website.indexOf('prettysecrets') != -1) {
            ret = div.find('img.lazy').attr('data-original');
        } else if (website.indexOf('fabfurnish') != -1) {
            ret = div.find('img.itm-img').attr('src');
        } else if (website.indexOf('urbanladder') != -1) {
            ret = div.find('a.product-img').find('img').attr('data-src');
            if (ret == '' || ret == null || ret == 'undefined') {
                ret = div.find('a.product-img').find('img').attr('src');
            }
            if (typeof ret != 'undefined' && ret.indexOf('//') != -1) {
                ret = ret.replace("//", '');
                ret = 'http://' + ret;
            }
        } else if (website.indexOf('elitify') != -1) {
            ret = div.find('div.relative').find('img').attr('data-src');
            if (typeof ret != 'undefined' && ret.indexOf('//') != -1) {
                ret = ret.replace("//", '');
                ret = 'http://' + ret;
            }
        } else if (website.indexOf('basicslife') != -1) {
            ret = div.find('div.productimage-shortlist-block').find('img').attr('src');
        } else if (website.indexOf('snapittoday') != -1) {
            ret = div.find('.scrm_data').first().text();
        } else if (website.indexOf('forever21') != -1) {
            ret = div.find('div.ItemImage').find('img').attr('src');
        } else if (website.indexOf('zara') != -1) {
            ret = div.find('img.product-img').attr('data-src');
            if (ret.indexOf('transparent') != -1) {
                ret = div.find('img.product-img').attr('src');
            }
            ret = ret.replace("//", '');
            ret = 'http://' + ret;
        } else if (website.indexOf('bata') != -1) {
            ret = div.find('div.product-image').find('img.lazy').attr('data-original');
        } else if (website.indexOf('miracas') != -1) {
            ret = div.find('a.product_img_link').find('img').attr('src');
        } else if (website.indexOf('Flipkart') != -1 || website.indexOf('flipkart') != -1) {
            if (div.productBaseInfoV1.imageUrls.unknown) {
                ret = div.productBaseInfoV1.imageUrls.unknown;
            }
            // if (div.find('a.pu-image').find('img').length > 0) {
            //     ret = div.find('a.pu-image').find('img').attr('data-src');
            // }
        } else if (website.indexOf('indiacircus') != -1) {
            if (div.find('a.product-image').find('img').length > 0) {
                ret = div.find('a.product-image').find('img').attr('src');
            }
        } else if (website.indexOf('trendin') != -1) {
            if (div.find('img').length > 0) {
                ret = div.find('img').attr('data-src');
            }
        }
        if (typeof ret == 'undefined' || ret == '') {
            ret = '';
        } else {
            ret = ret.trim();
        }
        return ret;
    },
    getHref: function (website, div) {
        if (website.indexOf('shopclues') != -1) {
            // jQuery('.col3').find('a').next().attr('href')
            if (div.find('a').length) {
                href = div.find('a').next().attr('href');
                if (href.indexOf('shopclues.com') == -1) {
                    href = "http://www.shopclues.com" + href;
                }
                return href;
            }
        } else if (website.indexOf('paytm') != -1) {
            if (typeof div['seourl'] != 'undefined' && div['seourl'] != '') {
                seo_url = div['seourl'];
                href = 'https://paytm.com/shop/p/' + generic_function.getLastSlash(seo_url);
                return href;
            }
        } else if (website.indexOf('snapdeal') != -1 || website.indexOf('Snapdeal') != -1) {
            if (div.find('div.product-tuple-description').find('a').length > 0) {
                return div.find('div.product-tuple-description').find('a').attr('href');
            }
            //return div.find('.product-title').find('a.prodLink').attr('href');
        } else if (website.indexOf('elitify') != -1) {
            var href = div.find('a').attr('href');
            href = 'http://www.elitify.com' + href;
            return href;
        } else if (website.indexOf('indiacircus') != -1) {
            if (div.find('a.product-image').length > 0) {
                href = div.find('a.product-image').attr('href');
                if (typeof href != 'undefined' && href.indexOf('/world') != -1) {
                    href = href.replace('/world', '');
                }
                return href;
            }
        } else if (website.indexOf('ezeekart') != -1) {
            return div.find('.product_link_style').eq(1).children('a').attr('href');
        } else if (website.indexOf('amazon') != -1) {
            if (div.find('.newaps').length > 0) {
                return div.find('.newaps').find('a').attr('href');
            }
            if (div.find('a.s-access-detail-page').length > 0) {
                return div.find('a.s-access-detail-page').attr('href')
            }

        } else if (website.indexOf('yepme') != -1) {
            return 'http://www.yepme.com/' + div.find('a.position').attr('href');
        } else if (website.indexOf('moodsofcloe') != -1) {
            if (div.find('p.margin-top5').find('a').length > 0) {
                return 'http://www.moodsofcloe.com' + div.find('p.margin-top5').find('a').attr('href');
            }
        } else if (website.indexOf('adexmart') != -1) {
            return div.find('.product-name').attr('href');
        } else if (website.indexOf('healthkart') != -1) {
            return div.find('.mrgn-t-10').find('a').attr('href');
        } else if (website.indexOf('fabfurnish') != -1) {
            return div.find('a.itm-link').attr('href');
        } else if (website.indexOf('urbanladder') != -1) {
            link = div.find('a.product-img').attr('href');
            return 'http://www.urbanladder.com' + link;
        } else if (website.indexOf('forever21') != -1) {
            return div.find('div.ItemImage').find('a').attr('href');
        } else if (website.indexOf('fabindia') != -1) {
            var href = div.find('a.product-image').attr('href');
            return href;
        } else if (website.indexOf('zara') != -1) {
            var href = div.find('a.item').attr('href');
            return href;
        } else if (website.indexOf('bata') != -1) {
            var href = div.find('div.product-image').find('a').attr('href');
            href = 'http://www.bata.in' + href;
            return href;
        } else if (website.indexOf('miracas') != -1) {
            var href = div.find('a.product_img_link').attr('href');
            return href;
        } else if (website.indexOf('Flipkart') != -1 || website.indexOf('flipkart') != -1) {
            if (div.productBaseInfoV1.productUrl) {
                href = div.productBaseInfoV1.productUrl;
                return href;
            }
            // if (div.find('a.fk-product-thumb').length > 0) {
            //     var href = div.find('a.fk-product-thumb').attr('href');
            //     href = 'http://www.flipkart.com' + href;
            //     return href;
            // }
        } else if (website.indexOf('trendin') != -1) {
            var href = div.find('a').attr('href');
            return href;
        }
        return "";
    },
    getAllSizes: function (website, div) { //return sizes in string
        var return_sizes = new Array();
        var return_sizes_str = '';
        if (website.indexOf('flipkart') != -1) {
            colorbox = div.find('.pu-swatch');
            $(colorbox).each(function () {
                sizes = '';
                $(this).find('.cp-sizes').find('div').find('.pop-title').remove();
                sizes = $(this).find('.cp-sizes').find('.lifestyle-size').text();
                sizes = generic_function.stringToArray(sizes, ',');
                for (i = 0; i < sizes.length; i++) {
                    if (return_sizes.indexOf(sizes[i]) == -1) {
                        return_sizes.push(sizes[i]);
                    }
                }
            });
        } else if (website.indexOf('myntra') != -1) {
            sizes = div.find('div.sizes').text();
            sizes = sizes.replace('Sizes:', "");
            return_sizes = generic_function.stringToArray(sizes, ',');
        } else if (website.indexOf('fashionara') != -1) {
            chk_is_size = div.find('.expand-info-inner').find('.colorswatch-item:nth-child(1)').find('div.label').text();
            if (chk_is_size == 'Available Sizes:') {
                ul_li = div.find('.expand-info-inner').find('.colorswatch-item:nth-child(1)').find('li');
                $(ul_li).each(function () {
                    ss = $(this).find('span.swatch').text();
                    return_sizes.push(ss);
                });
            }
        } else if (website.indexOf('snapdeal') != -1) {
            if (div.find('.sel-attribute').find('option').length > 0) {
                sl_opt = div.find('.sel-attribute').find('option');
                $(sl_opt).each(function () {
                    ss = $(this).attr('value');
                    ss = ss.trim();
                    if (ss != '') {
                        return_sizes.push(ss);
                    }
                });
            }
        } else if (website.indexOf('elitify') != -1) {
            if (div.find('div.sizes_on_hover').find('span').length > 0) {
                sl_opt = div.find('div.sizes_on_hover').find('span');
                $(sl_opt).each(function () {
                    ss = $(this).text();
                    ss = ss.trim();
                    if (ss.indexOf(',') != -1) {
                        ss = ss.replace(',', '');
                    }
                    if (ss != '') {
                        return_sizes.push(ss);
                    }
                });
            }
        } else if (website.indexOf('bewakoof') != -1) {
            sl_opt = div.find('span.product_select_home_size_button');
            $(sl_opt).each(function () {
                ss = $(this).text();
                ss = ss.trim();
                if (ss != '') {
                    return_sizes.push(ss);
                }
            });
        } else if (website.indexOf('yepme') != -1) {
            sl_opt = div.find('table.sizes').find('span.availsize');
            $(sl_opt).each(function () {
                ss = $(this).find('a').text();
                ss = ss.trim();
                if (ss != '') {
                    return_sizes.push(ss);
                }
            });
        } else if (website.indexOf('basicslife') != -1) {
            if (div.find('.first-div-for-tooltip').find('table').find('td:nth-child(3)').length > 0) {
                sl_opt = div.find('.first-div-for-tooltip').find('table').find('td:nth-child(3)').text();
                return_sizes = generic_function.stringToArray(sl_opt, ',');
            }
        } else if (website.indexOf('zivame') != -1) {
            if (div.find('span.size-unit').children('span').length > 0) {
                sl_opt = div.find('span.size-unit').children('span');
                $(sl_opt).each(function () {
                    ss = $(this).text();
                    ss = ss.trim();
                    if (ss != '') {
                        return_sizes.push(ss);
                    }
                });
            }
        } else if (website.indexOf('zovi.com') != -1) { //here webiste is full url && div contains json data
            //here in zovi div is a array // form json data
            p_raw_sizes = div['sizing_info'];
            Object.keys(p_raw_sizes).forEach(function (size) {
                aval_check = p_raw_sizes[size];
                aval_check = aval_check['avl'];
                if (aval_check == true) {
                    return_sizes.push(size);
                }
            });
        } else if (website.indexOf('shopnineteen') != -1) {
            if (div.find('ul.cat_size').children('li').length > 0) {
                sl_opt = div.find('ul.cat_size').children('li');
                $(sl_opt).each(function () {
                    if ($(this).find('strike').length == 0) {
                        ss = $(this).text();
                        ss = ss.trim();
                        if (ss != '') {
                            return_sizes.push(ss);
                        }
                    }
                });
            }
        } else if (website.indexOf('koovs') != -1) {
            if (div.find('span.sizeMeasurement').length > 0) {
                rawsizes = div.find('span.sizeMeasurement').text();
                sizes = generic_function.stringToArray(rawsizes, ',');
                for (i = 0; i < sizes.length; i++) {
                    if (return_sizes.indexOf(sizes[i]) == -1) {
                        return_sizes.push(sizes[i]);
                    }
                }
            }
        } else if (website.indexOf('trendin') != -1) {
            if (div.find('div.available-sizes').children('a').length > 0) {
                div.find('div.available-sizes').children('a').each(function () {
                    size = $(this).text();
                    return_sizes.push(size);
                });
            }
        } else if (website.indexOf('fabindia') != -1) {
            if (div.find('div.product-sizes').find('li').length > 0) {
                div.find('div.product-sizes').find('li').each(function () {
                    size = $(this).text();
                    if (size.toLowerCase() != 'sizes:') {
                        return_sizes.push(size);
                    }
                });
            }
        } else if (website.indexOf('bata') != -1) {
            if (div.find('div.attribute-list').find('input.size-button').length > 0) {
                div.find('div.attribute-list').find('input.size-button').each(function () {
                    size = $(this).attr('value');
                    is_color_text = $(this).attr('style');
                    if (typeof is_color_text == 'undefined') {
                        return_sizes.push(size);
                    }
                });
            }
        }

        if (return_sizes.length > 0) {
            return_sizes_str = generic_function.arrayToString(return_sizes, ',');
        }
        return return_sizes_str;
    },
    getAllColors: function (website, div) {
        var allColors = new Array();
        var colors = '';
        if (website.indexOf('flipkart') != -1) {
            colorbox = div.find('.pu-swatch');
            $(colorbox).each(function () {
                if ($(this).find('.cp-sizes').children('div').length == 1) { //means no color is defined as text
                    return;
                }
                $(this).find('.cp-sizes').find('div').find('.pop-title').remove();
                color = $(this).find('.cp-sizes').find('div:nth-child(1)').text();
                color = generic_function.stringToArray(color, ',');
                color = generic_function.arrayToString(color, '-');
                allColors.push(color);
            });
        } else if (website.indexOf('zovi') != -1) {
            allColors.push(div.attr('data-color'));
        } else if (website.indexOf('urbanladder') != -1) {
            if (div.find('a.product-title').length > 0) {
                name = div.find('a.product-title').attr('title');
                color = generic_function.getBracketText(name);
                if (color != '') {
                    if (color.indexOf(',') != -1) {
                        explodeColor = generic_function.stringToArray(color, ',');
                        explodeColor.forEach(function (color_1) {
                            color_1 = color_1.replace('Finish', '');
                            color_1 = color_1.replace('finish', '');
                            color_1 = color_1.trim();
                            allColors.push(color_1);
                        });
                    } else {
                        color = color.replace('Finish', '');
                        color = color.replace('finish', '');
                        color = color.trim();
                        allColors.push(color);
                    }
                }
                if (allColors.length > 0) {
                    colors = generic_function.arrayToString(allColors, ',');
                }
            }
        } else if (website.indexOf('bata') != -1) {
            if (div.find('div.color_breakline').find('input.size-button').length > 0) {
                div.find('div.color_breakline').find('input.size-button').each(function () {
                    color = $(this).attr('value');
                    allColors.push(color);
                });
            }
        }
        return colors;
    },
    getColorSizes: function (website, div) { //returns json data, color is key and sizes are in value
        var allColorSizes = {};
        var colorSizes = '';
        if (website.indexOf('flipkart') != -1) {
            colorbox = div.find('.pu-swatch');
            $(colorbox).each(function () {
                color = sizes = '';
                if ($(this).find('.cp-sizes').children('div').length == 1) { //means no color is defined as text
                    return;
                }
                $(this).find('.cp-sizes').find('div').find('.pop-title').remove();
                color = $(this).find('.cp-sizes').find('div:nth-child(1)').text();
                color = generic_function.stringToArray(color, ',');
                color = generic_function.arrayToString(color, '-');
                sizes = $(this).find('.cp-sizes').find('.lifestyle-size').text();
                if (sizes.length > 0) {
                    sizes = generic_function.stringToArray(sizes, ',');
                    allColorSizes[color] = sizes;
                }
            });
        }
        //console.log(allColorSizes);
        //console.log(Object.keys(allColorSizes).length);

        //process.exit(0);
        if (Object.keys(allColorSizes).length > 0) {
            colorSizes = JSON.stringify(allColorSizes);
        }
        return colorSizes;
    },
    getProductRating: function (website, div) {
        var rating = 0;
        if (website.indexOf('fabfurnish') != -1) {
            if (div.find('span.catItmRating').length > 0) {
                rawText = div.find('span.catItmRating').attr('style');
                var regRt = /width: [0-9\.]+%/;
                var rt_match = regRt.exec(rawText);
                if (rt_match !== null) {
                    var rate = /[0-9\.]+/;
                    var rt_match_1 = rate.exec(rt_match[0]);
                    if (rt_match_1 !== null) {
                        rating = rt_match_1[0];
                        rating = generic_function.manipulateRating('%', rating);
                    }
                }
            }
        }
        return rating;
    },
    getOffRate: function (website, div) {
        console.log
        var off_rate = 0;
        off_rate_text = '';
        if (website.indexOf('snapdeal') != -1) {
            off_rate_text = div.find('span.percDesc').text();
        } else if (website.indexOf('elitify') != -1) {
            if (div.find('div.savings').length > 0) {
                off_rate_text = div.find('div.savings').text();
            }
        } else if (website.indexOf('flipkart') != -1) {
            if (div.find('span.pu-off-per').length > 0) {
                off_rate_text = div.find('span.pu-off-per').text();
            }
        } else if (website.indexOf('myntra') != -1) {
            if (div.find('.price').children('span.discount').length > 0) {
                off_rate_text = div.find('.price').children('span.discount').text();
            }
        } else if (website.indexOf('snapdeal') != -1) {
            if (div.find('.product-price').find('s').length > 0) {
                off_rate_text = div.find('.product-price').find('s').text();
            }
        } else if (website.indexOf('indiatimes') != -1) {
            if (div.find('.price-details').find('.discount-price').length > 0) {
                off_rate_text = div.find('.price-details').find('.discount-price').text();
            }
        } else if (website.indexOf('fashionara') != -1) {
            if (div.find('.save-product-mask').children('.percent').length > 0) {
                off_rate_text = div.find('.save-product-mask').children('.percent').text();
            }
        } else if (website.indexOf('yepme') != -1) {
            $(div.find('div')).each(function () {
                id = $(this).attr('id');
                if (id == 'PnOfferAndMarketEqual') {
                } else if (id == 'PnOfferAndMarketNotEqual') {
                    off_rate_text = $(this).find('span:nth-child(5)').text();
                    return off_rate_text;
                }
            });
        } else if (website.indexOf('zovi') != -1) {
            //here div is an array// from json data
            var discount = div['discount'];
            if (discount > 0) {
                var sell_price = div['mrp'];
                off_rate_text = (discount / sell_price) * 100;
                off_rate_text = off_rate_text + '%';
                //console.log( discount + ' :: '+sell_price + ' :: '+ off_rate_text);
            }
        } else if (website.indexOf('moodsofcloe') != -1) {
            if (div.find('span.discountpre').length > 0) {
                off_rate_text = div.find('span.discountpre').text();
            }
        } else if (website.indexOf('zivame') != -1) {
            if (div.find('img.discount-tag').length > 0) {
                rt = div.find('.discount-tag').attr('pagespeed_lazy_src');
                var regRt = /Flat-[0-9\.]+/;
                var rt_match = regRt.exec(rt);
                if (rt_match !== null) {
                    rt_text = rt_match[0];
                    off_rate_text = rt_text + '%';
                }
            }
        } else if (website.indexOf('jabong') != -1) {
            if (div.find('span.discount').length > 0) {
                rt = div.find('span.discount').text();
                var regRt = /[0-9\.]+/;
                var rt_match = regRt.exec(rt);
                if (rt_match !== null) {
                    rt_text = rt_match[0];
                    off_rate_text = rt_text + '%';
                }
            }
        } else if (website.indexOf('fabfurnish') != -1) {
            if (div.find('.itm-saleFlagPerNew').length > 0) {
                rt = div.find('.itm-saleFlagPerNew').text();
                var regRt = /[0-9\.]+/;
                var rt_match = regRt.exec(rt);
                if (rt_match !== null) {
                    rt_text = rt_match[0];
                    off_rate_text = rt_text + '%';
                }
            }
        } else if (website.indexOf('shoppersstop') != -1) {
            if (div.find('span.saleD').length > 0) {
                rt = div.find('span.saleD').text();
                var regRt = /[0-9\.]+/;
                var rt_match = regRt.exec(rt);
                if (rt_match !== null) {
                    rt_text = rt_match[0];
                    off_rate_text = rt_text + '%';
                }
            }
        } else if (website.indexOf('amazon') != -1) {
            if (div.find('span.a-color-price').length > 0) {
                rt = div.find('span.a-color-price').text();
                var regRt = /[0-9\.]+%/;
                var rt_match = regRt.exec(rt);
                if (rt_match !== null) {
                    rt_text = rt_match[0];
                    off_rate_text = rt_text + '%';
                }
            }
        } else if (website.indexOf('ezoneonline') != -1) {
            if (div.find('span.badges').length > 0) {
                rt = div.find('span.badges').text();
                var regRt = /[0-9\.]+%/;
                var rt_match = regRt.exec(rt);
                if (rt_match !== null) {
                    rt_text = rt_match[0];
                    off_rate_text = rt_text + '%';
                }
            }
        }

        if (off_rate_text != '') {
            var value = off_rate_text;
            var regEx = /[0-9\.]+%/;
            var match = regEx.exec(value);
            if (match !== null) {
                off_rate = match[0];
                off_rate = off_rate.replace('%', '');
                off_rate = off_rate.trim();
            }
        }
        return off_rate;
    },
    getOfferText: function (website, div) {
        var offer_text = '';
        return offer_text;
    },
    getAllBrands: function (website, $, row) {
        console.log("get all brands :: " + website);
        var row_cat_id = row.cat_id;
        var row_sub_cat_id = row.sub_cat_id;
        context = this;
        brands = new Array();
        if (website == 'Flipkart' || website.indexOf('flipkart') != -1) {
            console.log(" getting flipkart brands");
            if ($('ul#brand').find('li').length > 0) {
                $('ul#brand').find('li').each(function () {
                    brand = $(this).attr('title');
                    brands.push(brand.trim());
                });
            }
        } else if (website.indexOf('myntra') != -1) {
            if ($("input[data-filter='brands_filter_facet']").length > 0) {
                tt = $("input[data-filter='brands_filter_facet']");
                $(tt).each(function () {
                    brand = $(this).attr('data-option');
                    brands.push(brand.trim());
                });
            }
        } else if (website.indexOf('amazon') != -1) {
            if ($('#left').find('h2').length > 0) {
                $('#left').find('h2').each(function () {
                    h2 = $(this).text();
                    h2 = h2.trim();
                    if (h2 == 'Brands') {
                        tt = $(this).next(['ul']).find('a');
                        $(tt).each(function () {
                            brand = $(this).attr('title');
                            if (brand)
                                brands.push(brand.trim());
                        });
                    }
                })
            }
        } else if (website.indexOf('zivame') != -1) {
            var regBr = /\([0-9]+\)/;
            if ($('#scrollbar_filters_brands').find('a').length > 0) {
                br = $('#scrollbar_filters_brands').find('a');
                $(br).each(function () {
                    brand = $(this).text();
                    match = regBr.exec(brand);
                    if (match !== null) {
                        brand = brand.replace(match[0], '');
                    }
                    brands.push(brand.trim());
                });
            }
        } else if (website.indexOf('basicslife') != -1) {
            if ($('#advancednavigation-filter-content-brand').length > 0) {
                tt = $('#advancednavigation-filter-content-brand').find('li').find('a');
                $(tt).each(function () {
                    brand = $(this).text();
                    brands.push(brand.trim());
                });
            }
        } else if (website.indexOf('fashionara') != -1) {
            $('#left_nav_filters').find('dl').each(function () {
                chk = $(this).attr('data-type');
                if (chk == 'brand') {
                    $(this).find('label.amshopby-attr').each(function () {
                        brand = $(this).attr('data-value').trim();
                        brand = brand.trim();
                        if (brand != 'all') {
                            brands.push(brand);
                        }
                    });
                }
            });
        } else if (website.indexOf('jabong') != -1) {
            if ($('#brands-json').length > 0) {
                try {
                    var json_brands = JSON.parse($('#brands-json').text());
                    Object.keys(json_brands).forEach(function (key) {
                        brand = key.trim();
                        if (brand != 'all' && brand != '') {
                            brands.push(brand);
                        }
                    });
                } catch (e) {
                    console.log(e);
                    console.log('err on line 1803');
                }
            }
        }
        brands.sort(function (a, b) {
            return b.length - a.length;
        });
        return brands;
    },
    extractJson: function (website, json) {

        var final_data = [];
        if (website.indexOf('faballey') != -1) {
            rawp = json.data;
            if (rawp != null) {
                Object.keys(rawp).forEach(function (key) {
                    final_data_price = {};
                    main_rawpp = rawp[key];
                    rawpp_url = 'http://www.faballey.com/' + main_rawpp.SeoName;
                    variants_list = rawp[key]['ProductVariant'];
                    rawpp = variants_list[0];
                    var curr_p_sizes = [];
                    var curr_p_colors = [];
                    Object.keys(variants_list).forEach(function (variantKey) {
                        var variant = variants_list[variantKey];
                        if (typeof variant['SizeChart']['SizeName'] != 'undefined' && variant['SizeChart']['IsActive'] == true) {
                            curr_p_sizes.push(variant['SizeChart']['SizeName']);
                        }
                        if (typeof variant['Size'] != 'undefined') {
                            var n_color = variant['Size'];
                            var c_exit = false;
                            for (i = 0; i < curr_p_colors.length; i++) {
                                if (n_color == curr_p_colors[i]) {
                                    c_exit = true;
                                }
                            }
                            if (c_exit == false) {
                                curr_p_colors.push(n_color);
                            }
                        }
                    });
                    curr_p_colors = generic_function.arrayToString(curr_p_colors, ',');
                    curr_p_sizes = generic_function.arrayToString(curr_p_sizes, ',');
                    if (typeof rawpp != 'undefined') {
                        final_data_price['name'] = rawpp['Name'];
                        final_data_price['img'] = "http://www.faballey.com/Images/Product/" + rawpp['SKU'] + "/1.jpg?v=2.0.0.1";
                        final_data_price['image'] = "http://www.faballey.com/Images/Product/" + rawpp['SKU'] + "/1.jpg?v=2.0.0.1";
                        final_data_price['href'] = rawpp_url;
                        final_data_price['url'] = rawpp_url;
                        final_data_price['brand'] = '';
                        final_data_price['price_class'] = '';
                        final_data_price['final_price'] = generic_function.getCleanNumber(rawpp['Price'] + "");
                        final_data_price['sizes'] = curr_p_sizes;
                        final_data_price['color'] = curr_p_colors;
                        final_data_price['off_rate'] = '';
                        final_data_price['website_rating'] = '';
                        final_data[final_data.length] = final_data_price;
                    }
                });
            }
        } else if (website.indexOf('snapdeal') != -1) {
            if (json.productDtos) {
                rawp = json.productDtos;
                Object.keys(rawp).forEach(function (key) {
                    final_data_price = {};
                    sizes = colors = '';
                    if (rawp[key]['initialAttributes'].length > 0) {
                        attr = rawp[key]['initialAttributes'];
                        sizes_arr = new Array();
                        Object.keys(attr).forEach(function (attr_key) {
                            if (attr[attr_key]['soldOut'] == false) {
                                size = attr[attr_key]['value'].trim();
                                sizes_arr.push(size);
                            }
                        });
                        if (sizes_arr.length > 0) {
                            sizes = generic_function.arrayToString(sizes_arr, ',');
                        }
                    }
                    rawpp = rawp[key];
                    final_data_price['name'] = rawpp['name'];
                    final_data_price['img'] = 'http://n3.sdlcdn.com/' + rawpp['image'];
                    final_data_price['image'] = 'http://n3.sdlcdn.com/' + rawpp['image'];
                    final_data_price['href'] = 'http://www.snapdeal.com/' + rawpp['pageUrl'];
                    final_data_price['url'] = 'http://www.snapdeal.com/' + rawpp['pageUrl'];
                    final_data_price['price_class'] = '';
                    final_data_price['final_price'] = rawpp['displayPrice'];
                    final_data_price['sizes'] = sizes;
                    final_data_price['color'] = colors;
                    final_data_price['color_wise_sizes'] = '';
                    final_data_price['off_rate'] = rawpp['discount'];
                    final_data[final_data.length] = final_data_price;
                });
            } else {
                return new Array();
            }

        } else if (website.indexOf('zovi') != -1) {
            rawp = json.option;
            if (rawp.length > 0) {
                Object.keys(rawp).forEach(function (key) {
                    rawpp = rawp[key];
                    final_data_price = {};

                    p_key = rawpp['option'];
                    p_name = rawpp['name'];
                    //p_image = 'http://d2zfu6byxx4psc.cloudfront.net/z/prod/w/2/g/p/' + p_key + '/1_c.jpg';
                    if (Parser.zoviImagePath != '') {
                        p_image = Parser.zoviImagePath + '/' + p_key + '/2_c.jpg';
                    } else {
                        p_image = 'http://s.zovi.com/bd1/g/p/' + p_key + '/2_c.jpg';
                    }
                    p_url = 'http://zovi.com/' + p_name.replace(/[\W_]+/g, "-").toLowerCase() + '--' + p_key;
                    p_price = rawpp['sell_price'];
                    p_sizes = Parser.getAllSizes(website, rawpp);
                    p_brand = extract_scrap_catalog.getBrandName(website, '', '');
                    p_offrate = extract_scrap_catalog.getOffRate(website, rawpp);

                    final_data_price['name'] = p_name;
                    final_data_price['img'] = p_image;
                    final_data_price['image'] = p_image;
                    final_data_price['href'] = p_url;
                    final_data_price['url'] = p_url;
                    final_data_price['brand'] = p_brand;
                    final_data_price['price_class'] = '';
                    final_data_price['final_price'] = p_price;
                    final_data_price['sizes'] = p_sizes;
                    final_data_price['color'] = '';
                    final_data_price['color_wise_sizes'] = '';
                    final_data_price['off_rate'] = p_offrate;
                    final_data_price['website_rating'] = '';
                    final_data[final_data.length] = final_data_price;
                });
            }
        } else if (website.indexOf('zansaar') != -1) {
            rawp = json.products;
            //console.log(json.length);
            //process.exit(0);
            if (rawp != null) {
                Object.keys(rawp).forEach(function (key) {
                    final_data_price = {};
                    rawpp = rawp[key];
                    final_data_price['name'] = rawpp['product_title'];
                    final_data_price['img'] = rawpp['image'];
                    final_data_price['image'] = rawpp['image'];
                    final_data_price['href'] = rawpp['url'];
                    final_data_price['url'] = rawpp['url'];
                    final_data_price['brand'] = rawpp['brand'];
                    final_data_price['price_class'] = '';
                    final_data_price['final_price'] = generic_function.getCleanNumber(rawpp['sales_price'] + "");
                    final_data_price['sizes'] = '';
                    final_data_price['color'] = rawpp['color'];
                    final_data_price['color_wise_sizes'] = '';
                    final_data_price['off_rate'] = generic_function.getCleanNumber(rawpp['discount_percentage'] + "");
                    final_data_price['website_rating'] = generic_function.manipulateRating('5', rawpp['product_rating'] + "");
                    final_data[final_data.length] = final_data_price;
                });
            }
        } else if (website.indexOf('paytm') != -1) {
            rawp = json.grid_layout;
            if (rawp != null) {
                Object.keys(rawp).forEach(function (key) {
                    final_data_price = {};
                    rawpp = rawp[key];
                    final_data_price['name'] = rawpp['name'];
                    final_data_price['img'] = rawpp['image_url'];
                    final_data_price['image'] = rawpp['image_url'];
                    var seo_url = rawpp['seourl'];
                    final_data_price['href'] = 'https://paytm.com/shop/p/' + generic_function.getLastSlash(seo_url);
                    final_data_price['url'] = 'https://paytm.com/shop/p/' + generic_function.getLastSlash(seo_url);
                    final_data_price['brand'] = rawpp['brand'];
                    final_data_price['price_class'] = '';
                    final_data_price['final_price'] = generic_function.getCleanNumber(rawpp['offer_price'] + "");
                    if (final_data_price['final_price'] == '') {
                        final_data_price['final_price'] = generic_function.getCleanNumber(rawpp['actual_price'] + "");
                    }
                    final_data_price['sizes'] = '';
                    final_data_price['color'] = '';
                    final_data_price['color_wise_sizes'] = '';
                    final_data_price['off_rate'] = generic_function.getCleanNumber(rawpp['discount'] + "");
                    final_data_price['website_rating'] = '';
                    final_data[final_data.length] = final_data_price;
                });
            }
        } else if (website.indexOf('jaypore') != -1) {
            rawp = json.products;
            //console.log(json.length);
            //process.exit(0);
            if (rawp != null) {
                Object.keys(rawp).forEach(function (key) {
                    final_data_price = {};
                    rawpp = rawp[key];
                    if (rawpp['sold_out'] == 0) {
                        final_data_price['name'] = rawpp['pname'];
                        final_data_price['img'] = rawpp['img1'];
                        final_data_price['image'] = rawpp['img1'];
                        final_data_price['href'] = rawpp['url'];
                        final_data_price['url'] = rawpp['url'];
                        final_data_price['brand'] = '';
                        final_data_price['price_class'] = '';
                        final_data_price['final_price'] = 1;
                        final_data_price['sizes'] = '';
                        final_data_price['color'] = '';
                        final_data_price['color_wise_sizes'] = '';
                        final_data_price['off_rate'] = '';
                        final_data_price['website_rating'] = '';
                    }
                    final_data[final_data.length] = final_data_price;
                });
            }
        } else if (website.indexOf('myntra') != -1) {
            console.log('myntra hai');
            rawp = json.data.results.products;
            if (rawp != null) {
                Object.keys(rawp).forEach(function (key) {
                    final_data_price = {};
                    rawpp = rawp[key];
                    final_data_price['name'] = rawpp['product'];
                    final_data_price['img'] = rawpp['search_image'];
                    final_data_price['image'] = rawpp['search_image'];
                    final_data_price['href'] = 'http://www.myntra.com/' + rawpp['dre_landing_page_url'];
                    final_data_price['url'] = 'http://www.myntra.com/' + rawpp['dre_landing_page_url'];
                    final_data_price['brand'] = '';
                    final_data_price['price_class'] = '';
                    final_data_price['final_price'] = rawpp['price'];
                    final_data_price['sizes'] = rawpp['sizes'];
                    final_data_price['color'] = '';
                    final_data_price['color_wise_sizes'] = '';
                    final_data_price['off_rate'] = '';
                    final_data_price['website_rating'] = '';
                    final_data[final_data.length] = final_data_price;
                });
            }
        } else if (website.indexOf('crunchcommerce') != -1) {
            //crunchcommerce == indiacircus
            console.log('indiacircus hai');
            rawp = json.results;
            if (rawp != null) {
                Object.keys(rawp).forEach(function (key) {
                    final_data_price = {};
                    rawpp = rawp[key];
                    final_data_price['name'] = rawpp['name'];
                    final_data_price['img'] = '';
                    final_data_price['image'] = '';
                    if (typeof rawpp.thumbnail.url != 'undefined') {
                        final_data_price['img'] = rawpp.thumbnail.url;
                        final_data_price['image'] = rawpp.thumbnail.url;
                    }
                    final_data_price['href'] = 'http://m.indiacircus.com/' + rawpp['resourceUri'];
                    final_data_price['url'] = 'http://m.indiacircus.com/' + rawpp['resourceUri'];
                    final_data_price['brand'] = '';
                    final_data_price['price_class'] = '';
                    final_data_price['final_price'] = rawpp['finalPrice'];
                    final_data_price['sizes'] = '';
                    final_data_price['color'] = '';
                    final_data_price['color_wise_sizes'] = '';
                    final_data_price['off_rate'] = '';
                    final_data_price['website_rating'] = '';
                    final_data[final_data.length] = final_data_price;
                });
            }
        }
        return final_data;
    },
    getModelNumber: function (website, productData) {
        var model = '';
        var rawText = '';
        if (website.indexOf('Flipkart') != -1) {
            rawText = productData.image;
            rawText = generic_function.getLastSlash(rawText);
            rawText = rawText.replace('-q-q', ''); // for q&q brand
            rawTextArray = generic_function.stringToArray(rawText, '-');
            //rawModel = rawTextArray[0];
            //if( isAlphaNumeric(rawModel) == true ){
            //model = rawModel;
            //}
            //console.log( rawText+' :::: '+ model);
            var isAlphaFound = false;
            var isAlphaNumFound = false;
            var dontCheckNext = false;
            rawTextArray.forEach(function (name_part) {
                if (name_part == '275x275') {
                    dontCheckNext = true;
                }
                if (dontCheckNext == false) {



                    if (isAlphaNumFound == false) {
                        if (model == '') {
                            model = name_part;
                        } else {
                            model += '-' + name_part;
                        }
                    } else {
                        if (generic_function.isAlpha(name_part) == false && isAlphaFound == false) {
                            model += '-' + name_part;
                            //console.log('ccc ---- '+ name_part);
                            //console.log(model);
                            //process.exit(0);
                        }
                        {
                            isAlphaFound = true;
                        }
                    }
                    if (generic_function.isAlphaNumeric(name_part) == true || generic_function.isNumeric(name_part)) {
                        //console.log( "isAlphaNumFound true === "+name_part );
                        isAlphaNumFound = true;
                    }
                }

            });
            //console.log( rawText+' :::: '+ model);
            //console.log('------------------------------------------');
        } else if (website.indexOf('Snapdeal') != -1) {
            rawText = productData.name;
            rawTextArray = generic_function.stringToArray(rawText, ' ');
            rawTextArray.forEach(function (name_part) {
                var re = new RegExp('-', 'g');
                name_part_mod = name_part.replace(re, '');
                if (generic_function.isAlphaNumeric(name_part_mod) == true && model == '') {
                    model = name_part;
                }
            });
        } else if (website.indexOf('amazon') != -1) {
            rawText = productData.name;
            rawTextArray = generic_function.stringToArray(rawText, ' ');
            rawModelText = rawTextArray[rawTextArray.length - 1];
            if (generic_function.isAlphaNumeric(rawModelText)) {
                model = rawModelText;
            }
        } else if (website.indexOf('jabong') != -1) {
            rawText = productData.name;
            rawTextArray = generic_function.stringToArray(rawText, ' ');
            rawTextArray.forEach(function (name_part) {
                var re = new RegExp('-', 'g');
                name_part_mod = name_part.replace(re, '');
                if (generic_function.isAlphaNumeric(name_part_mod) == true && model == '') {
                    model = name_part;
                }
            });
        } else if (website.indexOf('myntra') != -1) {
            rawText = productData.name;
            rawTextArray = generic_function.stringToArray(rawText, ' ');
            rawTextArray.forEach(function (name_part) {
                var re = new RegExp('-', 'g');
                name_part_mod = name_part.replace(re, '');
                if (generic_function.isAlphaNumeric(name_part_mod) == true && model == '') {
                    model = name_part;
                }
            });
        } else if (website.indexOf('paytm') != -1) {
            rawText = productData.name;
            rawTextArray = generic_function.stringToArray(rawText, ' ');
            rawTextArray.forEach(function (name_part) {
                var re = new RegExp('-', 'g');
                name_part_mod = name_part.replace(re, '');
                if (generic_function.isAlphaNumeric(name_part_mod) == true && model == '') {
                    model = name_part;
                }
            });
        }
        return model;
    },
};
module.exports = scrap_catalog;