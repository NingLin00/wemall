
require('./index.css');
require('page/common/header/index.js');
var nav             = require('page/common/nav/index.js');
var _ajax           = require('util/ajax.js');
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
        this.loadCart();

    },
    bindEvent : function(){
        var _this = this;
        //商品选中|取消选中
        $(document).on('click', '.cart-select', function () {
            var $_this = this,
                productId = $_this.parents('.cart-table').data('product-id');
            //选中
            if ($_this.is(':chcked')) {
                //传入productId
                _cart.selectProduct(productId, function (res) {
                    _this.renderCart(res);
                },function (errMsg) {
                    _this.showCartError();
                })
            }else {
                //取消选中
                _cart.unselectProduct(productId,function (res) {
                    _this.renderCart(res);
                },function (errMsg) {
                    _this.showCartError();
                })
            }
        });
        //商品的全选|取消全选
        $(document).on('click', '.cart-select-all', function () {
            var $_this = this;
            // 全选
            if ($_this.is(':checked')) {
                _cart.selectAllProduct(function (res) {
                    _this.renderCart(res);
                },function (errMsg) {
                    _this.showCartError();
                })
            }else {
                //取消全选
                _cart.unselectAllProduct(function (res) {
                    _this.renderCart(res);
                },function (errMsg) {
                    _this.showCartError();
                })
            }
        });
        // 商品数量的变化
        $(document).on('click', '.count-btn', function(){
            var $this       = $(this),
                $pCount     = $this.siblings('.count-input'),
                currCount   = parseInt($pCount.val()),
                type        = $this.hasClass('plus') ? 'plus' : 'minus',
                productId   = $this.parents('.cart-table').data('product-id'),
                minCount    = 1,
                maxCount    = parseInt($pCount.data('max')),
                newCount    = 0;
            if(type === 'plus'){
                if(currCount >= maxCount){
                    _ajax.errorTips('该商品数量已达到上限');
                    return;
                }
                newCount = currCount + 1;
            }else if(type === 'minus'){
                if(currCount <= minCount){
                    return;
                }
                newCount = currCount - 1;
            }
            // 更新购物车商品数量
            _cart.updateProduct({
                productId : productId,
                count : newCount
            }, function(res){
                _this.renderCart(res);
            }, function(errMsg){
                _this.showCartError();
            });
        });
        // 删除单个商品
        $(document).on('click', '.cart-delete', function(){
            if(window.confirm('确认要删除该商品？')){
                var productId = $(this).parents('.cart-table')
                    .data('product-id');
                _this.deleteCartProduct(productId);
            }
        });
        // 删除选中商品
        $(document).on('click', '.delete-selected', function(){
            if(window.confirm('确认要删除选中的商品吗？')){
                var arrProductIds = [],
                    $selectedItem = $('.cart-select:checked');
                // 循环查找选中的productIds
                for(var i = 0, iLength = $selectedItem.length; i < iLength; i ++){
                    arrProductIds
                        .push($($selectedItem[i]).parents('.cart-table').data('product-id'));
                }
                if(arrProductIds.length){
                    _this.deleteCartProduct(arrProductIds.join(','));
                }
                else{
                    _ajax.errorTips('您还没有选中要删除的商品');
                }
            }
        });
        // 提交购物车结算
        $(document).on('click', '.btn-submit', function(){
            // 总价大于0，进行提交
            if(_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0){
                window.location.href = './order-confirm.html';
            }else{
                _ajax.errorTips('请选择商品后再提交');
            }
        });
    },
    //加载购物车
    loadCart: function () {
        var _this       = this;
        // 获取购物车列表
        _cart.getCartList(function(res){
            _this.renderCart(res);
        }, function(errMsg){
            _this.showCartError();
        })
    },
    // 渲染购物车
    renderCart : function(data){
        this.filter(data);
        // 缓存购物车信息
        this.data.cartInfo = data;
        // 生成HTML
        var cartHtml = _ajax.renderHtml(htmlTemplate, data);
        $('.page-wrap').html(cartHtml);
        // 通知导航的购物车更新数量
        nav.loadCartCount();
    },
    // 删除指定商品，支持多个，productId用逗号分割
    deleteCartProduct : function(productIds){
        var _this = this;
        _cart.deleteProduct(productIds, function(res){
            _this.renderCart(res);
        }, function(errMsg){
            _this.showCartError();
        });
    },
    // 数据匹配
    filter : function(data){
        data.notEmpty = !!data.cartProductVoList.length;
    },
    // 显示错误信息
    showCartError: function(){
        $('.page-wrap').html('<p class="err-tip">哪里不对了，刷新试试~ </p>');
    }
};
$(function(){
    page.init();
});