var sql = require('../sql/sql.js');

module.exports = function(req, res){
	var body = req.body;
	var result = {
		errorCode: null,
		result: {}
	}
	if ( body.account == "" || body.password == ""){
		result.errorCode = 5;
		res.write(JSON.stringify(result));
		res.end();
	} else {
		sql.pool.getConnection(function(err, connection) {
			if ( err ) { 
				console.log(err);
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.write('Database error');
				res.end();
			} else {

				connection.query("select name from user where account = ?", body.account, function (err, rows, fields){
					if (err) {
						connection.release();
						console.log(err);
						result.errorCode = 2;
						res.write(JSON.stringify(result));
						res.end();
					} else if (rows.length !== 0){
						connection.release();
						result.errorCode = 4;
						result.result = rows;
						res.write(JSON.stringify(result));
						res.end();
					} else {


						var params = [body.account, body.account, body.password, 0, 'imgurl', (new Date()).valueOf(), 0];

						connection.query("insert into user(name,account,password,gender,headimg,timestamp,freeze) values (?,?,?,?,?,?,?)", params, function (err, rows, fields){

							if (err) {
								connection.release();
								console.log(err);
								result.errorCode = 2;
								res.write(JSON.stringify(result));
								res.end();
							} else {


								var actions = [],
									params = [body.account, body.account, body.password, 0, 'imgurl', (new Date()).valueOf(), 0];

								var content = JSON.stringify({
									"category": {
										"交通": ["地铁","公交","共享单车","滴滴","的士"],
										"饮食": ["早餐","午餐","下午茶","晚餐","夜宵","零食"],
										"服饰": ["上衣","下衣","鞋子","配饰"],
										"住宿": ["房租","供房","酒店宾馆"],
										"娱乐": ["电影","聚会","棋牌","运动","演唱会"],
										"医疗": ["保健品","药品","治疗"],
										"其他": ["丢失","不明支出"]
									},
									"payway": ["现金","微信支付","支付宝","大学城一卡通","银行卡"],
									"project": [],
									"role": []
								})

								var params = [rows.insertId, content];

								actions.push({
									query: "insert into config(ownerid, content) values(?, ?);",
									params: params
								});


								sql.series(actions, function(err, sqlresult){
									if (err) { 
										return connection.rollback(function() {
											console.log(err);
											result.errorCode = 2;
											res.write(JSON.stringify(result));
											res.end();
										}); 
									} else {
										connection.commit(function(err) {
											if (err) {
												return connection.rollback(function() {
													console.log(err);
													result.errorCode = 2;
													res.write(JSON.stringify(result));
													res.end();
												});
											} else {
												result.errorCode = 0;
												res.write(JSON.stringify(result));
												res.end();
											}
										});
									}
								})





							}

						})










					}
				})
			}
		});
	}
}

