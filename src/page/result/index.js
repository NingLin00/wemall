
require('./index.css');
require('page/common/nav-simple/index.js');

var _ajax = require('util/ajax');

$(function(){
    var type        = _ajax.getUrlParam('type') || 'default',
        $element    = $('.' + type + '-success');
    // 显示对应的提示元素
    $element.show();
})