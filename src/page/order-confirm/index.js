
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _ajax            = require('util/ajax.js');
var _address         = require('service/address-service.js');
var _order           = require('service/order-service.js');
var templateAddress  = require('./address-list.string');
var templateProduct  = require('./product-list.string');
var addressModal     = require('./address-model');

var page = {
    data:{
        selectedAdressId: null
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        this.loadAddressList();
        this.loadProductList();
    },
    bindEvent : function(){
        var _this = this;
        //收货地址的选择
        $(document).on('click', '.address-item', function () {
            $(this).addClass('active')
                .siblings('.address-item').removeClass('active');
            _this.data.selectedAdressId = $(this).data('id');
        });
        //收货地址的添加
        $(document).on('click', '.address-add', function () {
            addressModal.show({
                isUpdate: false,
                onSuccess: function () {
                    _this.loadAddressList()
                }
            })
        });
        //收货地址的编辑
        $(document).on('click', '.address-update', function (e) {
            e.stopPropagation();
            //当前地址框的id
            var shippingId = $(this).parents('.address-item').data('id');
            _address.getAddress(shippingId, function (res) {
                addressModal.show({
                    isUpdate : true,
                    data     : res,
                    onSuccess: function () {
                        _this.loadAddressList()
                    }
                })
            }, function (errMsg) {
                _ajax.errorTips(errMsg)
            });

        });
        //收货地址的删除
        $(document).on('click', '.address-delete', function (e) {
            e.stopPropagation();
            //当前地址框的id
            var shippingId = $(this).parents('.address-item').data('id');
                if (window.confirm('确定删除该地址吗？')) {
                    _address.deleteAddress(shippingId, function (res) {
                        _this.loadAddressList();
                    }, function (errMsg) {
                        _ajax.errorTips(errMsg)
                    });
                }
        });
        //提交订单点击逻辑
        $(document).on('click', '.order-submit', function () {
            var addressId = _this.data.selectedAdressId;
            if (addressId) {
                _order.createOrder({shippingId:addressId},function (res) {
                    window.location.href = './payment.html?orderNumber'+ res.orderNo;
                },function (errMsg) {
                    _ajax.errorTips(errMsg);
                })
            }
        })

    },
    //加载地址列表方法
    loadAddressList: function () {
        var $addressCon = $('.address-con'),
                  _this = this;
        $addressCon.html('<div class="loading"></div>');
        _address.getAddressList(function (res) {
            _this.addressFilter(res);
            var addressHtml = _ajax.renderHtml(templateAddress, res);
            $addressCon.html(addressHtml);
        },function (errMsg) {
            $addressCon.html('<p class="err-tip">地址加载失败，请刷新重试</p>')
        })

    },
    //选中状态的处理
    addressFilter: function(data){
        if (this.data.selectedAdressId) {
            var selectedAddressIdFlag = false;
            for (var i = 0, length = data.list.length; i < length; i++){
                if (data.list[i].id === this.data.selectedAdressId) {
                    data.list[i].isActive = true;
                    selectedAddressIdFlag  = true;
                };
                if (!selectedAddressIdFlag) {
                    this.data.selectedAdressId = null;
                }
            }
        }
    },
    // 加载商品清单方法
    loadProductList : function(){
        var $productCon = $('.product-con'),
            _this = this;
        $productCon.html('<div class="loading"></div>');
        _order.getProductList(function (res) {
            var productHtml = _ajax.renderHtml(templateProduct, res);
            $productCon.html(productHtml);
        },function (errMsg) {
            $productCon.html('<p class="err-tip">商品清单加载失败，请刷新重试</p>')
        })

    }
};
$(function(){
    page.init();
});