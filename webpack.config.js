var path                = require('path');
var webpack             = require('webpack');
//var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');


 // 环境变量配置，dev / online
 var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';
//获取HtmlConfig参数的方法
var getHtmlConfig = function (name,title) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        inject  : true,
        hash    : true,
        title   : title,
        chunks  :['common',name]
    }
};
var config = {
    mode: 'production',
    entry:{//入口文件
        'common'                :['./src/page/common/index.js'],              //公共模块
        'index'                 :['./src/page/index/index.js'],               //首页
        'list'                  :['./src/page/list/index.js'],                //商品列表
        'user-login'            :['./src/page/user-login/index.js'],          //登录
        'user-register'         :['./src/page/user-register/index.js'],       //注册
        'user-password-reset'   :['./src/page/user-password-reset/index.js'], //找回密码
        'user-center'           :['./src/page/user-center/index.js'],         //个人中心
        'user-center-update'    :['./src/page/user-center-update/index.js'],  //修改个人信息
        'user-password-update'  :['./src/page/user-password-update/index.js'],//修改密码
        'detail'                :['./src/page/detail/index.js'],              //商品详情
        'cart'                  :['./src/page/cart/index.js'],                //购物车
        'order-confirm'         :['./src/page/order-confirm/index.js'],       //订单确认
        'order-list'            :['./src/page/order-list/index.js'],          //订单列表
        'order-detail'          :['./src/page/order-detail/index.js'],        //订单详情
        'payment'               :['./src/page/payment/index.js'],             //支付页面
        'result'                :['./src/page/result/index.js'],              //操作结果
    },
    output:{//输出文件
        filename: 'js/[name].bundle.js',
        publicPath:'/dist/',
        path: path.resolve(__dirname ,'dist')},
    externals: {//加载外部变量或者模块
        'jquery' : 'window.jQuery'
        },
    module: {
        rules:[
            //加载并引用css，
            // {
            //     test: /\.css$/,
            //     //loader: ExtractTextPlugin.extract("css-loader","style-loader"),
            //     use:  ExtractTextPlugin.extract({ use: 'css-loader' })
            //
            // },
            {// 处理css
                test: /\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]

            },

            //处理图片
            {
                test: /\.(gif|png|jpg)\??.*$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit:8192,
                            name:'resource/[name].[ext]'
                        }
                    }
                ]
            },
            //处理字体
            { test: /\.(woff|svg|eot|ttf)\??.*$/,
                use: [
                    {
                        loader: 'url-loader',
                        options:{
                            limit:8192,
                            name:'resource/[name].[ext]'
                        }
                    }
                ]
            },
            //渲染模板文件处理
            {
                test: /\.string$/,
                use: [
                    {
                        loader: 'html-loader',
                        options:{
                            minimize: true,
                        }
                    }
                ]
            }

        ]
    },
    // optimization:{
    //     splitChunks:{
    //         cacheGroups: {
    //             // 注意: priority属性
    //             // 其次: 打包业务中公共代码
    //             common: {
    //                 name: "common",
    //                 chunks: "async",
    //                 enforce: true,
    //                 priority: 0,
    //             },
    //             //首先: 打包node_modules中的文件
    //             vendor: {
    //                 name: "common",
    //                 test: /[\\/]node_modules[\\/]/,
    //                 chunks: "all",
    //                 priority: 5,
    //                 //filename: 'common'
    //             }
    //         }
    //     }
    // },
    plugins:[
        //单独打包css
        //new ExtractTextPlugin('css/[name].css'),
        //单独打包css
        new MiniCssExtractPlugin({filename:'css/[name].css'}),
        new webpack.HotModuleReplacementPlugin(),
        //生成一个 HTML5模板文件
        new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login','登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register','注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-password-reset','找回密码')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')),
        new HtmlWebpackPlugin(getHtmlConfig('user-password-update','修改密码')),
        new HtmlWebpackPlugin(getHtmlConfig('list','商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认页')),
        new HtmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),
        new HtmlWebpackPlugin(getHtmlConfig('order-detail','订单详情')),
        new HtmlWebpackPlugin(getHtmlConfig('detail','商品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('payment','商品支付')),
        new HtmlWebpackPlugin(getHtmlConfig('result',' 操作结果'))
    ],
    resolve:{
        alias :{
            node_modules    : __dirname + '/node_modules',
            util            : __dirname + '/src/util',
            image           : __dirname + '/src/image',
            page            : __dirname + '/src/page',
            service         : __dirname + '/src/service',
        }
    },
    devServer:{
        contentBase: path.resolve(__dirname, '/dist/view'),
        open: true,
        hot:true,
        hotOnly:true
    },
};
 if('dev' === WEBPACK_ENV){
     config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
 }

module.exports = config;