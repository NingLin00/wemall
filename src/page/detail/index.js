
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _ajax           = require('util/ajax.js');
var _product        = require('service/product-service.js');
var _cart           = require('service/cart-service.js');
var htmlTemplate    = require('./index.string');

var page = {
    data:{
         productId:    _ajax.getUrlParam('productId') || ''
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        //判断productId,无则回到首页
        if (!this.data.productId){
            _ajax.toHome()
        }
        //调用加载商品详情方法
        this.loadDetail();
    },
    bindEvent : function(){
        var _this = this;
        //  鼠标移动图片预览
        $(document).on('mouseenter', '.p-img-item', function(){
            var imageUrl   = $(this).find('.p-img').attr('src');
            $('.main-img').attr('src', imageUrl);
        });
        // 数量的操作
        $(document).on('click', '.p-count-btn', function(){
            var type        = $(this).hasClass('plus') ? 'plus' : 'minus',
                $pCount     = $('.p-count'),
                currCount   = parseInt($pCount.val()),
                minCount    = 1,
                maxCount    = _this.data.detailInfo.stock || 1;
            if(type === 'plus'){
                $pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
            }
            else if(type === 'minus'){
                $pCount.val(currCount > minCount ? currCount - 1 : minCount);
            }
        });
        // 加入购物车
        $(document).on('click', '.cart-add', function(){
            _cart.addToCart({
                productId   : _this.data.productId,
                count       : $('.p-count').val()
            }, function(res){
                window.location.href = './result.html?type=cart-add';
            }, function(errMsg){
                _ajax.errorTips(errMsg);
            });
        });
    },
    //加载商品详情方法
    loadDetail: function () {
        var _this   = this,
            html    = '',
            $pagewrap = $('.page-wrap');
            $pagewrap.html('<div class="loading"></div>');
        _product.getProductDetail(this.data.productId, function (res) {
            _this.filter(data);
            html = _ajax.renderHtml(htmlTemplate, res);
            $pagewrap.html(html);
        },function (errMsg) {
            $pagewrap.html('<p class="err-tip">抱歉，我们未找到该商品~~</p>');
        })
    },
    // 数据匹配
    filter : function(data){
        data.subImages = data.subImages.split(',');
    }
};
$(function(){
    page.init();
});