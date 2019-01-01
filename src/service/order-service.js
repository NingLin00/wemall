
var _ajax = require('util/ajax.js');

var _order = {
    // 获取商品列表
    getProductList : function(resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/order/get_order_cart_product.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 提交订单
    createOrder : function(orderInfo, resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/order/create.do'),
            data    : orderInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取订单列表
    getOrderList: function(listParam, resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/order/list.do'),
            data    : listParam,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    //获取订单详情
    getOrderDetail: function(orderNumber, resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/order/detail.do'),
            data    : {
                orderNo: orderNumber,
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    //取消订单
    cancelOrder:function(orderNumber, resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/order/cancel.do'),
            data    : {
                orderNo: orderNumber,
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }
};
module.exports = _order;