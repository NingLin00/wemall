
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _ajax           = require('util/ajax.js');
var _product        = require('service/product-service.js');
var Pagination      = require('util/pagination/index.js');
var htmlTemplate    = require('./index.string');

// 商品列表JS处理
var page = {
    data:{
        listParam: {
            keyword:     _ajax.getUrlParam('keyword') || '',
            categoryId:  _ajax.getUrlParam('categoryId') || '',
            orderBy:     _ajax.getUrlParam('orderBy') || 'default',
            pageNum:     _ajax.getUrlParam('pageNum') || 1,
            pageSize:    _ajax.getUrlParam('pageSize') || 20
        }
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        this.loadList();
    },
    bindEvent : function(){
        var _this = this;
        // 排序的点击事件
        $('.sort-item').click(function(){
            var $this = $(this);
            _this.data.listParam.pageNum = 1;
            // 点击默认排序
            if($this.data('type') === 'default'){
                // 已经是active样式
                if($this.hasClass('active')) {
                    return;
                }
                // 其他
                else{
                    $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');//移除多个样式
                    _this.data.listParam.orderBy = 'default';
                }
            }
            // 点击价格排序
            else if($this.data('type') === 'price'){
                // active class 的处理
                $this.addClass('active').siblings('.sort-item')
                    .removeClass('active asc desc');
                // 升序、降序的处理
                if(!$this.hasClass('asc')){
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'price_asc';
                }else{
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy = 'price_desc';
                }
            }
            // 重新加载列表
            _this.loadList();
        });
    },
    loadList: function () {
        var _this     = this,
            listHtml  = '',
            $pListCon = $('.p-list-con'),
            listParam = this.data.listParam;
        //初始化容器
        $pListCon.html('<div class="loading"></div>');
        // 删除参数中不必要的字段
        listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);
        //请求获取商品列表的方法
        _product.getProductList(listParam, function (res) {
            //把回调成功的数据渲染到模板
            listHtml = _ajax.renderHtml(htmlTemplate,{list: res.list});
            $pListCon.html(listHtml);
            //调用加载分页数据的方法,传入参数
            _this.loadPagination({
                hasPreviousPage : res.hasPreviousPage,
                prePage         : res.prePage,
                hasNextPage     : res.hasNextPage,
                nextPage        : res.nextPage,
                pageNum         : res.pageNum,
                pages           : res.pages
            })
        }, function (errMsg) {
            _ajax.errorTips(errMsg);
        })
    },
    // 加载分页信息
    loadPagination : function(pageInfo){
        var _this = this;
        this.pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({}, pageInfo, {
            container : $('.pagination'),
            onSelectPage : function(pageNum){
                _this.data.listParam.pageNum = pageNum;
                _this.loadList();
            }
        }));
    }
};
$(function(){
    page.init();
});