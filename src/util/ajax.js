

var Hogan = require('hogan.js');
var conf = {
    serverHost : ''
};



var _ajax = {
    request : function (param) {
        var _this = this;
        $.ajax({
            type     : param.method || 'get',
            url      : param.url    || '',
            dataType : param.type   || 'json',
            data     : param.data   || '',
            success  : function(res) {
                if (0 === res.status){//请求成功
                    typeof param.success === "function" && param.success(res.data,res.msg)
                }else if (10 === res.status) {//无登录状态强制登录
                    _this.toLogin();
                }else if (1 === res.status){//请求错误
                    typeof param.error === "function" && param.error(res.msg)
                }
            },
            error    : function(err){
                typeof param.error === "function" && param.error(err.statusText)
            }
        });
    },
    // 获取服务器地址
    getServerUrl : function(path){
        return conf.serverHost + path;
    },
    // 获取url参数
    getUrlParam : function(name){
        var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result  = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 渲染html模板
    renderHtml : function(htmlTemplate, data){
        var template = Hogan.compile(htmlTemplate),
         result = template.render(data);
        return result;
    },
    // 成功提示
    successTips : function(msg){
        alert(msg || '操作成功！');
    },
    // 错误提示
    errorTips : function(msg){
        alert(msg || '哪里不对了~');
    },
    // 字段的验证
    validate : function(value, type){
        var value = $.trim(value);
        // 非空验证
        if('require' === type){
            return !!value;
        }
        // 手机号验证
        if('phone' === type){
            return /^1\d{10}$/.test(value);
        }
        // 邮箱格式验证
        if('email' === type){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    //统一登录跳转
    toLogin : function () {
            window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    toHome : function(){
        window.location.href = './index.html';
    }
};

module.exports = _ajax;