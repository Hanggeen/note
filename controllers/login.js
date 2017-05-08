var sql = require('../sql/sql.js');

module.exports = function(req, res){
	var result = {
		errorCode: null,
		result:{}
	}

	sql.pool.getConnection(function(err, connection) {

		var account = req.body.account;
		var password = req.body.password;

		var query = 'select id,name from user where account = ? and password = ?';
		var params = [account, password];
		connection.query(query, params, function(err, rows, fields) {
			connection.release();
			if (err) {
				console.log(err);
				res.writeHead(500, {'Content-Type': 'text/plain'});
				result.errorCode = 2;
			} else {
				if (rows.length != 0) {
					result.errorCode = 0;
					result.result.id = rows[0].id;
					result.result.name = rows[0].name;
					req.session.login = true;
					req.session.id = rows[0].id;
					req.session.name = rows[0].name;
					req.session.account = account;
				} else {
					result.errorCode = 1;
				}
			}
			res.writeHead(200,{'Content-Type': 'application/json'});
			res.write(JSON.stringify(result));
    		res.end();
		});

	});
}