var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path=require('path');
var cssExtract=new ExtractTextPlugin("[name].[contenthash:8].css");

var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports={
    entry: {
        index:'../src/js/app.js'
    },
    output:{
        path:path.resolve(__dirname, "../dist"),
        publicPath:"./",//TODO 填写生产环境静态文件路径
        filename:'[name].[chunkhash:8].bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.min.js',
            'vue-router':  'vue-router/dist/vue-router.min.js'
        }
    },
    module: {
        loaders: [
            {test: /\.vue$/, loader: 'vue'},
            {test: /\.css$/, loader: cssExtract.extract("style-loader", "css-loader") },
            {test:/\.html$/,loader:'html-loader'},
            {test:/\.(png|jpg)$/,loader: 'url-loader?limit=8192'},
            {test:/\.(woff|svg|eot|ttf)\??.*$/,loader:'url-loader?name=fonts/[name].[md5:hash:hex:7}.[ext]'}
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true,
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            filename: '../dist/index.html',
            template: path.resolve(__dirname, '../dist/index.html'),
            inject: true
        }),
        cssExtract
    ]
}