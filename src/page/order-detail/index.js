
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

var navSide      = require('page/common/nav-side/index.js');
var _ajax        = require('util/ajax.js');
var _order       = require('service/user-service.js');
var htmlTemplate = require('./index.string');

// page 逻辑部分
var page = {
    data:{
        orderNumber: _ajax.getUrlParam('orderNumber')
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        //加载订单详情
        this.loadDetail();
        //初始化侧边导航
        navSide.init({name: 'order-detail'});

    },
    bindEvent: function(){
        var _this = this;
        $(document).on('click', '.order-cancel', function () {
            if (window.confirm('确认取消该订单吗？')) {
                _order.cancelOrder(this.data.orderNumber, function (res) {
                    _ajax.successTips('订单取消成功。');
                    _this.loadDetail();
                }, function (errMsg) {
                    _ajax.errorTips(errMsg);
                });
            }
        });
    },
    //加载订单详情
    loadDetail: function () {
        var _this         = this,
            orderDetailHtml = '',
            $content         = $('content');
        $content.html('<div class="loading"></div>');
        _order.getOrderDetail(this.data.orderNumber, function (res) {
            _this.dataFilter(res);
            orderDetailHtml = _ajax.renderHtml(htmlTemplate, res);
            $content.html(orderDetailHtml);
        },function (errMsg) {
            $content.html('<p class="err-tip">'+ errMsg +'</p>');
        });
    },
    //数据适配
    dataFilter: function (data) {
        data.needPay        = data.status == 10;
        data.isCancelable   = data.status == 10;
    }
};
$(function(){
    page.init();
});