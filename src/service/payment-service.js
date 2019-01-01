
var _ajax = require('util/ajax.js');

var _payment = {
    // 获取支付信息
    getPaymentInfo: function(orderNumber, resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/order/pay.do'),
            data    : {
                orderNo:orderNumber
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取订单状态获取
    getPaymentStatus: function(orderNumber, resolve, reject){
        _ajax.request({
            url     : _ajax.getServerUrl('/order/query_order_pay_status.do'),
            data    : {
                orderNo:orderNumber
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }
};
module.exports = _payment;