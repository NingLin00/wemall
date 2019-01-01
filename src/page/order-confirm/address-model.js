
var _ajax                = require('util/ajax.js');
var _cities             = require('util/cities/index');
var _address             = require('service/address-service.js');
var addressModelTemplate = require('./address-model.string');



var addressModel = {
    show: function (option) {
        this.$modelWrap  = $('.model-wrap');
        // 绑定
        this.option      = option;
        this.option.data = option.data || {};
        // 渲然页面
        this.loadModel();
        // 绑定事件
        this.bindEvent();
    },
    //添加新地址完成后关闭模态框model
    hide: function () {
        this.$modelWrap.empty();
    },
    // 渲然页面
    loadModel: function () {
        var addressModelHtml = _ajax.renderHtml(addressModelTemplate, {
            isUpdate: this.option.isUpdate,
            data    : this.option.data
        });
        this.$modelWrap.html(addressModelHtml);
        // 加载省份/城市
        this.loadProvince();

    },
    // 加载省份信息
    loadProvince: function(){
        var provinces       = _cities.getProvince() || [],
            $provinceSelect = this.$modelWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));
        //更新地址，省份的回填
        if (this.option.isUpdate && this.option.data.receiverProvince) {
            $provinceSelect.val(this.option.data.receiverProvince);
            // 加载市/区
            this.loadCities();
        }
    },
    // 加载市/区信息
    loadCities  : function(provinceName){
        var cities      = _cities.getCities(provinceName) || [],
            $citySelect = this.$modelWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));
        // 市/区的回填
        if (this.option.isUpdate && this.option.data.receiverCity) {
            $citySelect.val(this.option.data.receiverCity);
        }
    },
    //获取select框的选项
    getSelectOption: function(optionArray){
        var html = '<option value="">请选择</option>';
        for (var i = 0, length = optionArray.length;i < length;i++){
            html += '<option value="'+optionArray[i]+'">'+ optionArray[i] +'</option>'
        }
        return html;
    },
    // 绑定事件
    bindEvent: function () {
        var _this = this;
        //省份和城市的二级联动
        this.$modelWrap.find('#receiver-province').change(function () {
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });
        //保存收获地址
        this.$modelWrap.find('.address-btn').click(function () {
            var receiverInfo = _this.getReceiverInfo(),
                isUpdate     = _this.option.isUpdate;
            // 使用新地址，且验证通过
            if (!isUpdate && receiverInfo.status){
                _address.save(receiverInfo.data, function (res) {
                    _ajax.successTips('地址添加成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                    }, function (errMsg) {
                    _ajax.errorTips(errMsg);
                });
            }
            //更新地址，且验证通过
            else if (isUpdate && receiverInfo.status) {
                _address.update(receiverInfo.data, function (res) {
                    _ajax.successTips('地址修改成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                }, function (errMsg) {
                    _ajax.errorTips(errMsg);
                });
            }
            //验证不通过
            else{
                _ajax.errorTips('error！操作失败');
            }
        });
        this.$modelWrap.find('.model-container').click(function (e) {
            e.stopPropagation();
        }),
        //点击X号关闭添加地址model框
        this.$modelWrap.find('.close').click(function () {
            _this.hide();
         })
    },
    //收集表单地址并验证
    getReceiverInfo: function () {
        var receiverInfo = {},
            result       = {
            state: true,
            };

        receiverInfo.provinceName     = $.trim(this.$modelWrap.find('#receiver-name'));
        receiverInfo.provinceProvince = this.$modelWrap.find('#receiver-province');
        receiverInfo.provinceCity     = this.$modelWrap.find('#receiver-city');
        receiverInfo.provinceAddress  = $.trim(this.$modelWrap.find('#receiver-address'));
        receiverInfo.provincePhone    = $.trim(this.$modelWrap.find('#receiver-phone'));
        receiverInfo.provinceZip      = $.trim(this.$modelWrap.find('#receiver-zip'));
        if (this.option.isUpdate){
          receiverInfo.provinceId     = this.$modelWrap.find('#receiver-id');
        }
        //验证
        if (!receiverInfo.provinceName) {
            result.errMsg('请输入收件人姓名')
        }else if (!receiverInfo.provinceProvince){
            result.errMsg('请选择省份信息')
        }else if (!receiverInfo.provinceCity){
            result.errMsg('请选择市/区信息')
        }else if (!receiverInfo.provinceAddress){
            result.errMsg('请输入详细地址')
        }else if (!receiverInfo.provincePhone){
            result.errMsg('请输入收件人手机号码')
        }else if (!receiverInfo.provinceZip){
            result.errMsg('请输入邮政编码')
        }else{
            result.states = true;
            result.data   = receiverInfo;
        }
        return result;
    }
};
module.exports = addressModel;