require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

var _ajax        = require('util/ajax.js');
var _payment     = require('service/payment-service.js');
var htmlTemplate = require('./index.string');

// page 逻辑部分
var page = {
    data:{
        orderNumber: _ajax.getUrlParam('orderNumber')
    },
    init: function(){
        //this.onLoad();
    },
    onLoad : function(){
        //加载支付信息
        this.loadPaymentInfo();
    },
    //加载支付信息方法
    loadPaymentInfo: function () {
        var _this         = this,
            paymentHtml = '',
            $pageWrap         = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNumber, function (res) {
            paymentHtml = _ajax.renderHtml(htmlTemplate, res);
            $pageWrap.html(paymentHtml);
            //轮询监听订单状态
            _this.listenOrderStatus();
        },function (errMsg) {
            $pageWrap.html('<p class="err-tip">'+ errMsg +'</p>');
        });
    },
    // 监听订单状态
    listenOrderStatus: function () {
        var _this  = this;
        this.paymentTimer = window.setInterval(function () {
            _payment.getPaymentStatus(_this.data.orderNumber, function (res) {
                if (res == true){
                    window.location.href = './result.html?type=payment&orderNumber='+ _this.data.orderNumber;
                }
            })
        }, 5e3);
    }
};
$(function(){
    page.init();
});