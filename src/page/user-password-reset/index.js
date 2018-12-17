'use strict';

require('./index.css');
require('page/common/nav-simple/index.js');

var _user   = require('service/user-service.js');
var _ajax = require('util/ajax.js');

// 表单里的错误提示
var formError = {
    show : function(errMsg){
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide : function(){
        $('.error-item').hide().find('.err-msg').text('');
    }
};

// page 逻辑部分
var page = {
    //存取数据的容器对象
    data:{
        username: '',
        question: '',
        answer  : '',
        token   : '',
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        this.loadStepUsername();
    },
    bindEvent : function(){
        var _this = this;
        //  找回密码第一步点击事件逻辑
        $('#submit-username').click(function(){
            //取输入框用户名的值
            var username = $.trim($('#username').val());
            // 用户名存在
            if (username) {
                _user.getQuestion(username ,function (res) {
                    _this.data.username = username;
                    _this.data.question = res;
                    _this.loadStepQuestion();
                },function (errMsg) {
                    formError.show(errMsg);
                })
            }
            //用户名为空或不存在
            else{
                formError.show('请输入用户名')
            }
        });

        //找回密码第二步输入密码提示问题答案的点击事件逻辑
        $('#submit-question').click(function(){
            //取输入框密码提示问题答案的值
            var answer = $.trim($('#answer').val());
            // 如果有值
            if (answer) {
                // 检查答案
                _user.checkAnswer({
                    username: _this.data.username,
                    question: _this.data.question,
                     answer : answer
                    }, function (res) {
                    _this.data.answer = answer;
                    _this.data.token = res;
                    _this.loadStepPassword();
                },function (errMsg) {
                    formError.show(errMsg);
                })
            }
            //如果答案为空或错误
            else{
                formError.show('请输入密码提示问题答案')
            }
        });

        //找回密码第三步重置密码点击事件逻辑
        $('#submit-password').click(function(){
            //取重置密码输入框的值
            var password = $.trim($('#password').val());
            // 如果有值
            if (password && password.length >= 6) {
                // 检查答案
                _user.resetPassword({
                    username    : _this.data.username,
                    passwordNew : password,
                    forgeToken  : _this.data.token
                }, function (res) {
                    window.location.href = './result.html?type=reset-password';
                },function (errMsg) {
                    formError.show(errMsg);
                })
            }
            //如果答案为空或错误
            else{
                formError.show('请输入不少于6位数的密码')
            }
        });
    },
    //显示第一步输入用户名
    loadStepUsername: function (){$('.step-username').show();},
    //加载第二步提示问题
    loadStepQuestion: function (){
        formError.hide();          //如果有错误信息，隐藏
        $('.step-username').hide()//用户名输入隐藏
            .siblings('.step-question').show()//提示问题输入模块显示
            .find('.question').text(this.data.question);//提示问题显示出来
    },
    //加载第三步重置密码
    loadStepPassword: function (){
        formError.hide();
        $('.step-question').hide().siblings('.step-password').show();
    },
    // 提交表单
    submit : function(){
        var formData = {
                username : $.trim($('#username').val()),
                password : $.trim($('#password').val())
            },
            // 表单验证结果
            validateResult = this.formValidate(formData);
        // 验证成功
        if(validateResult.status){
            _user.login(formData, function(res){
                window.location.href = _ajax.getUrlParam('redirect') || './index.html';
            }, function(errMsg){
                formError.show(errMsg);
            });
        }
        // 验证失败
        else{
            // 错误提示
            formError.show(validateResult.msg);
        }

    },
    // 表单字段的验证

};
$(function(){
    page.init();
});