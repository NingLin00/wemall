

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _ajax   = require('util/ajax.js');
var _user   = require('service/user-service.js');
var htmlTemplate = require('./index.string');

// page 逻辑部分
var page = {
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    bindEvent: function(){
        var _this = this;
        $(document).on('click', '.btn-submit', function () {
            var userInfo = {
                phone   : $.trim($('#phone').val()),
                email   : $.trim($('#email').val()),
                question: $.trim($('#question').val()),
                answer  : $.trim($('#answer').val())
            }
            var validateResult = _this.validateForm(userInfo);
            if (validateResult.status){
                _user.updateUserInfo(userInfo, function (res,msg) {
                    _ajax.successTips(msg);
                    window.location.href = './user-center.html';
                },function (errMsg) {
                    _ajax.errorTips(errMsg)
                });
            }else {
                _ajax.errorTips(validateResult.msg);
            }
        })
    },
    onLoad : function(){
        //初始化侧边导航
        navSide.init({name: 'user-center'});
        //调用加载用户信息方法
        this.loadUserInfo();
    },
    //加载用户信息方法
    loadUserInfo: function () {
        var userHtml = '';
        _user.getUserInfo(function (res) {
            userHtml = _ajax.renderHtml(htmlTemplate, res);
            $('.panel-body').html(userHtml)
        },function (errMsg) {

        });
    },
    //验证表单的方法
    validateForm: function (formData) {
        var result = {
            status  : false,
            msg     : ''
        };
        if(!_ajax.validate(formData.phone, 'phone')){
            result.msg = '手机号码格式不正确';
            return result;
        }
        if(!_ajax.validate(formData.email, 'email')){
            result.msg = '邮箱格式不正确';
            return result;
        }
        if(!_ajax.validate(formData.question, 'require')){
            result.msg = '密码提示问题不能为空';
            return result;
        }
        if(!_ajax.validate(formData.answer, 'require')){
            result.msg = '密码提示问题答案不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status   = true;
        result.msg      = '验证通过';
        return result;
    }
};
$(function(){
    page.init();
});