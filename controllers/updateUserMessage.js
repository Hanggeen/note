var sql = require('../sql/sql.js');

module.exports = function(req, res){
	var result = {
		errorCode: null,
		result:{}
	}

	sql.pool.getConnection(function(err, connection) {

		var query = 'update user set name = ?, phone = ? where id = ?';
		var params = [req.body.name, req.body.phone, req.session.id];

		connection.query(query, params, function(err, rows, fields) {
			connection.release();
			if (err) {
				console.log(err);
				res.writeHead(500, {'Content-Type': 'text/plain'});
				result.errorCode = 2;
			} else {
				result.errorCode = 0;
			}
			res.writeHead(200,{'Content-Type': 'application/json'});
			res.write(JSON.stringify(result));
    		res.end();
		});

	});
}