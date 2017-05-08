var sql = require('../sql/sql.js');

module.exports = function(req, res){

	var result = {
		errorCode: null,
		result:{}
	}

	req.session.login = false;

	result.errorCode = 0;

	res.writeHead(200,{'Content-Type': 'application/json'});
	res.write(JSON.stringify(result));
    res.end();

}