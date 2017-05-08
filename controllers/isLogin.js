var sql = require('../sql/sql.js');

module.exports = function(req, res){
	var result = {
		errorCode: null,
		result:{}
	}

	if (req.session.login) {
		result.errorCode = 0;
	} else {
		result.errorCode = 3;
	}

	res.writeHead(200,{'Content-Type': 'application/json'});
	res.write(JSON.stringify(result));
    res.end();

}