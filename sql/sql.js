var mysql = require('mysql');
var async = require('async');
var config = require('./config.js');



var pool = mysql.createPool(config);

exports.pool = pool;

exports.series = function(actions, outCallback){
	pool.getConnection(function(err, connection) {
		if (err) { outCallback(err, null); }
		connection.beginTransaction(function(err) {
			if(err) {
				connection.release();
				outCallback(err, null);
			} else {
				var funcs = [];
				actions.forEach(function(item, index, array) {
					funcs.push(function(callback){
						connection.query(item.query, item.params, callback);
					})
				});
				async.series(funcs, function(err, result) {
					if(err) {
						connection.rollback(function() {
							connection.release();
							outCallback(err, null);
						})
					} else {
						connection.commit(function(err) {
							if(err) {
								connection.rollback(function() {
									connection.release();
									outCallback(err, null);
								});
							} else {
								connection.release();
								outCallback(null, result);
							}
						})
					}
				})
			}
		})
	})
}