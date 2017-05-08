var sql = require('../sql/sql.js');

module.exports = function(req, res){
	var result = {
		errorCode: null,
		result:{}
	}

	sql.pool.getConnection(function(err, connection) {

		var query = 'select * from bill where ownerid = ? and timestamp between ? and ? order by timestamp asc';

		var start = (new Date(req.body.startDate).valueOf() - (8*3600*1000));
		var end = (new Date(req.body.endDate).valueOf() + (16*3600*1000));

		var params = [req.session.id, start, end];
		connection.query(query, params, function(err, rows, fields) {
			connection.release();
			if (err) {
				console.log(err);
				res.writeHead(500, {'Content-Type': 'text/plain'});
				result.errorCode = 2;
			} else {
				var format = function (date) {
					var date = new Date(date),
						y = String(date.getFullYear()),
						m = date.getMonth(),
						d = String(date.getDate());
					m++;
					if(m<10){m="0"+String(m)};
					if(d<10){d="0"+String(d)};
					return y+"-"+m+"-"+d;
				}


				rows.forEach(function (item, index, array) {
					item.date = format(item.timestamp);
				})

				result.errorCode = 0;
				result.result = rows;
			}
			res.writeHead(200,{'Content-Type': 'application/json'});
			res.write(JSON.stringify(result));
    		res.end();
		});

	});
}