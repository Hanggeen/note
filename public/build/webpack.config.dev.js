var webpack = require('webpack');
var path=require('path');
module.exports={
    //这里写成数组是为了dev server插入服务配置
    entry: {
        "app":['../src/js/app.js'],
    },
    output:{
        path:path.resolve(__dirname, "../dist"),//__dirname+'/../dist',
        publicPath: "/dist/",//dev server 会从此路径去拿hot-update.json
        filename:'[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.common.js',
            'vue-router':  'vue-router/dist/vue-router.common.js'
        }
    },
    module: {
        loaders: [
            {test: /\.vue$/, loader: 'vue'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            {test:/\.html$/,loader:'html-loader'},
            {test:/\.(woff|svg|eot|ttf)\??.*$/,loader:'url-loader?name=fonts/[name].[md5:hash:hex:7}.[ext]'}
        ]
    },
    plugins: [

    ],
    devtool: "source-map"
}