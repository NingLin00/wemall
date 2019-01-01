
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _ajax = require('util/ajax.js');
var _user = require('service/user-service.js');


// page 逻辑部分
var page = {
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        //初始化侧边导航
        navSide.init({name: 'user-password-update'});
    },
    bindEvent: function(){
        var _this = this;
        $(document).on('click', '.btn-submit', function () {
            var userInfo = {
                password        : $.trim($('#password').val()),
                passwordNew     : $.trim($('#password-new').val()),
                passwordConfirm : $.trim($('#password-confirm').val())
            };
            var validateResult = _this.validateForm(userInfo);
            if (validateResult.status){
                //调用方法更新密码
                _user.updatePassword({
                    passwordOld: password,
                    passwordNew: userInfo.passwordNew
                }, function (res,msg) {
                    _ajax.successTips(msg);
                },function (errMsg) {
                    _ajax.errorTips(errMsg)
                });
            }else {
                _ajax.errorTips(validateResult.msg);
            }
        })
    },

    //验证表单的方法
    validateForm: function (formData) {
        var result = {
            status  : false,
            msg     : ''
        };
        // 验证原密码是否为空
        if(!_ajax.validate(formData.password, 'require')){
            result.msg = '请输入原密码';
            return result;
        }
        if(!formData.passwordNew || formData.passwordNew.length < 6){
            result.msg = '新密码长度不得小于6位';
            $('#password-new').val('');
            return result;
        }
        if(formData.passwordNew !== formData.passwordConfirm){
            result.msg = '两次密码输入不一致';
            $('#password-confirm').val('');
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