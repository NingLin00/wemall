
require('./index.css');
require('page/common/nav-simple/index.js');

var _ajax = require('util/ajax');

$(function(){
    var type        = _ajax.getUrlParam('type') || 'default',
        $element    = $('.' + type + '-success');
    //判断是否是支付页面
    if (type === 'payment'){
        //缓存订单号
        var orderNumber = _ajax.getUrlParam('orderNumber'),
           $orderNumber = $element.find('.order-number');
        $orderNumber.attr('href', $orderNumber.attr('href') + orderNumber)
    }
    // 显示对应的提示元素
    $element.show();
})