// 引入gulp系列模块
var gulp = require("gulp");
var gutil = require("gulp-util");//便于给gulp使用的函数，如util.log()打印结果
var greplace = require("gulp-replace");//用于替换(正则、字符串)
var concat = require('gulp-concat')//使用gulp-concat合并JavaScript文件，减少网络请求

// 引入webpack系列模块
var webpack=require("webpack");
var webpackConfig=require("./webpack.config.js");//打包开发代码的webpack配置是用这个文件
var webpackConfigDev=require("./webpack.config.dev.js");//打包开发代码的webpack配置是用这个文件
var WebpackDevServer = require("webpack-dev-server");//开发环境下的服务器

// 引入node.js的模块
var path=require("path");
var fs=require("fs");



/**
 * 使用测试配置打包，启动hot dev server
 */
gulp.task('webpack-dev',function(){
    //新建一个对象，把开发环境配置文件webpack.config.dev.js变成对象传进去
    var config = Object.create(webpackConfigDev);
    //这两项配置原本是在webpack.config.dev.js里边配置，可是通过gulp启动devserver，那种配置无效，只能在此处写入
    //官网的解释是webpack-dev-server没有权限读取webpack的配置
    config.entry.app.unshift("webpack-dev-server/client?http://localhost:8091/", "webpack/hot/dev-server");
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    // 把配置丢进webpack，返回一个模块
    var compiler = webpack(config);
    
    var server = new WebpackDevServer(compiler, {
        contentBase: "../",
        publicPath: "/dist/",
        hot: true,
        compress: false,
        stats: { colors: true }
    });
    server.listen(8091, "localhost", function() {});
    // server.close();
});



/**
 * 使用正式配置打包
 */
gulp.task('webpack-build',['upload-source'],function () {
    //新建一个对象，把生产环境配置文件webpack.config.js变成对象传进去
    var config = Object.create(webpackConfig);
    webpack(config, function(err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }
        gutil.log("[webpack]", stats.toString({}));
    });
});



gulp.task('upload-source',function(){
    //TODO
    //1.上传刚刚生成的文件到CDN or 线上环境静态服务器
    //2.正则匹配index.html，替换js文件路径为CDN路径，将index.html写入dist
    // 此工作可尝试用webpack插件https://github.com/ampedandwired/html-webpack-plugin完成
    gulp.src('../src/index.html')
        .pipe(greplace('<script src="../dist/app.bundle.js"></script>'," "))
        .pipe(gulp.dest('../dist'));
    console.log("replace ok")
});

gulp.task("default",["webpack-dev"]);
gulp.task("build",["webpack-build"]);
gulp.task("dist",["webpack-build","upload-source"]);