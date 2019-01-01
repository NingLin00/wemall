var _ajax = require('util/ajax.js');

var _address = {
    // 获取地址列表
    getAddressList: function (resolve, reject) {
        _ajax.request({
            url: _ajax.getServerUrl('/shipping/list.do'),
            method: 'POST',
            data: {pageSize: 50},
            success: resolve,
            error: reject
        });
    },
    // 保存收货地址
    save: function (addressInfo, resolve, reject) {
        _ajax.request({
            url: _ajax.getServerUrl('/shipping/add.do'),
            method: 'POST',
            data: addressInfo,
            success: resolve,
            error: reject
        });
    },
    // 更新收货地址
    update: function (addressInfo, resolve, reject) {
        _ajax.request({
            url: _ajax.getServerUrl('/shipping/update.do'),
            method: 'POST',
            data: addressInfo,
            success: resolve,
            error: reject
        });
    },
    deleteAddress: function (shippingId, resolve, reject) {
        _ajax.request({
            url: _ajax.getServerUrl('/shipping/del.do'),
            method: 'POST',
            data: {shippingId: shippingId},
            success: resolve,
            error: reject
        });
    },
    //获取单条收货地址信息
    getAddress: function (shippingId, resolve, reject) {
        _ajax.request({
            url: _ajax.getServerUrl('/shipping/select.do'),
            method: 'POST',
            data: {shippingId: shippingId},
            success: resolve,
            error: reject
        });
    }
};
module.exports = _address;