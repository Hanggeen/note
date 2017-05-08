var Vue = require('vue')
var VueRouter = require('vue-router');
Vue.use(VueRouter)

// 组件
var Header = require('./components/Header');
var Popup = require('./components/Popup');
var record = require('./routes/record');
var graphics = require('./routes/graphics');
var detail = require('./routes/detail');
var analysis = require('./routes/analysis');
var community = require('./routes/community');
var configure = require('./routes/configure');
var userMessage = require('./routes/userMessage');

// index的模板文件
var template = require('./app.html');


// 全局设置ajax
require('./modules/ajax');

// 引入样式
require('../css/main.css');


var routes = [
    {
        path: '/',
        redirect: '/record'
    },
    { 
        path: '/record', 
        component: record
    },
    { 
        path: '/graphics', 
        component: graphics
    },
    { 
        path: '/detail', 
        component: detail
    },
    { 
        path: '/analysis', 
        component: analysis
    },
    { 
        path: '/community', 
        component: community
    },
    { 
        path: '/configure', 
        component: configure
    },
    { 
        path: '/userMessage', 
        component: userMessage
    }
];

var router = new VueRouter({
  routes: routes
});

var app = new Vue({
    router: router,
    template: template,
    replace: true,
    components: {
        'app-header':Header,
        'pop-up': Popup
    }
}).$mount('#app');
