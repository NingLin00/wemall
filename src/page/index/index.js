

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/slider/index.js');
var navSide        = require('page/common/nav-side/index.js');
var templateBanner = require('./banner.string');
var _ajax          = require('util/ajax.js');

$(function() {
        // 渲染轮播图的html模板
    var bannerHtml  = _ajax.renderHtml(templateBanner);
    $('.banner-con').html(bannerHtml);
    // 初始化轮播图
    var $slider     = $('.banner').unslider({
        dots: true,
        pause:true,
    });

        // 前一张和后一张操作的事件绑定
    $('.banner-con .banner-arrow').click(function(){
        var forward = $(this).hasClass('prev') ? 'prev' : 'next';
        $slider.data('unslider')[forward]();
    });
});



