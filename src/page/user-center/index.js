
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

var navSide = require('page/common/nav-side/index.js');
var _ajax = require('util/ajax.js');
var _user = require('service/user-service.js');
var htmlTemplate = require('./index.string');

// page 逻辑部分
var page = {
    init: function(){
        this.onLoad();
    },
    onLoad : function(){
        //初始化侧边导航
        navSide.init({name: 'user-center'});
        //加载用户信息
        this.loadUserInfo();
    },
    //加载用户信息逻辑
    loadUserInfo: function () {
        var userHtml = '';
        _user.getUserInfo(function (res) {
            userHtml = _ajax.renderHtml(htmlTemplate, res);
            $('.panel-body').html(userHtml)
        },function (errMsg) {

        });
    }
};
$(function(){
    page.init();
});