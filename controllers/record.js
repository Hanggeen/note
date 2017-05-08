var sql = require('../sql/sql.js');

module.exports = function(req, res){
	var result = {
		errorCode: null,
		result:{}
	}

	sql.pool.getConnection(function(err, connection) {

		var timestamp = (new Date(req.body.date)).valueOf();
		var body = req.body;

		var query = 'insert into bill(ownerid, note, timestamp, price, category, sort, payway, project, role) values(?,?,?,?,?,?,?,?,?)';
		var params = [req.session.id, body.note, timestamp, body.price, body.category, body.sort, body.payway, body.project, body.role];
		connection.query(query, params, function(err, rows, fields) {
			connection.release();
			if (err) {
				console.log(err);
				res.writeHead(500, {'Content-Type': 'text/plain'});
				result.errorCode = 2;
			} else {
				console.log(rows);
				if (rows.length != 0) {
					result.errorCode = 0;
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