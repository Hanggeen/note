var sql = require('../sql/sql.js');

module.exports = function(req, res){
	var result = {
		errorCode: null,
		result:{}
	}

	sql.pool.getConnection(function(err, connection) {

		var query = 'select content from config where ownerid = ?';
		var params = [req.session.id];
		connection.query(query, params, function(err, rows, fields) {
			connection.release();
			if (err) {
				console.log(err);
				res.writeHead(500, {'Content-Type': 'text/plain'});
				result.errorCode = 2;
			} else {
				if (rows.length != 0) {
					result.errorCode = 0;
					result.result = JSON.parse(rows[0].content);
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