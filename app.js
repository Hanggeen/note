var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var path = require('path');


var app = express();




var login = require('./controllers/login.js');
var isLogin = require('./controllers/isLogin.js');
var logout = require('./controllers/logout.js');
var register = require('./controllers/register.js');
var fetchConfig = require('./controllers/fetchConfig.js');
var record = require('./controllers/record.js');
var fetchBill = require('./controllers/fetchBill.js');
var updateConfig = require('./controllers/updateConfig.js');
var deleteDetail = require('./controllers/deleteDetail.js');
var fetchUser = require('./controllers/fetchUser.js');
var updateUserMessage = require('./controllers/updateUserMessage.js');


// 静态资源文件
app.use(express.static('public/dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



app.use(cookieSession({
  name: 'session',
  keys: ['Hanggeen','niamoi'],
  maxAge: 24 * 60 * 60 * 1000 
}))


app.get('/', function (req, res) {
   res.send('Hello World');
})



function testLogin(req, res, next){
	if (req.session.login !== true) {
		var result = {
			errorCode: 3,
			result: {}
		}
		res.writeHead(200,{'Content-Type': 'application/json'});
		res.write(JSON.stringify(result));
   		res.end();
	} else {
		next();
	}
}


app.post('/api/login', login);
app.post('/api/isLogin', isLogin);
app.post('/api/logout', logout);
app.post('/api/register', register);
app.post('/api/fetchConfig', testLogin, fetchConfig);
app.post('/api/updateConfig', testLogin, updateConfig);
app.post('/api/record', testLogin, record);
app.post('/api/fetchBill', testLogin, fetchBill);
app.post('/api/deleteDetail', testLogin, deleteDetail);
app.post('/api/fetchUser', testLogin, fetchUser);
app.post('/api/updateUserMessage', testLogin, updateUserMessage);



var server = app.listen(81, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

