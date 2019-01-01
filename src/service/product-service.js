
var _ajax = require('util/ajax.js');

var _product = {
    // 获取商品列表
    getProductList : function(listParam, resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/product/list.do'),
            data    : listParam,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取商品详细信息
    getProductDetail : function(productId, resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/product/detail.do'),
            data    : {
                productId : productId
            },
            success : resolve,
            error   : reject
        });
    }
};
module.exports = _product;