// 从option(echart预配置)文件从把配置方案深拷贝过来，然后打包数据
var options = require('./options.js');

function deepCopy(p, c) {
	var c = c || {};
	for (var i in p) {
		if (typeof p[i] === 'object') {
			c[i] = (p[i].constructor === Array) ? [] : {};
			deepCopy(p[i], c[i]);
		} else {
			c[i] = p[i];
		}
	}
	return c;
}

module.exports = {
	sum: function (data) {
		var sum = 0;
		data.forEach(function (o, index, array) {
			sum += o.price
		});
		return sum;
	},
	highestNote: function (data) {
		if (data.length == 0) {
			return '无';
		}
		var highest = {
			price: -2
		}
		data.forEach(function (o, index, array) {
			if (o.price > highest.price) {
				highest = o;
			}
		});
		return highest.note;
	},
	dayNum: function (data) {
		var date = '';
		var num = 0;
		data.forEach(function (o, index, array) {
			if (o.date != date) {
				num ++;
				date = o.date;
			}
		});
		return num;
	},
	monthLine: function (data) {

		if (data.length == 0) {
			return 'noDataOption';
		}
		var legend = ['当日消费'],
			date = [],
			daysum = [],
			sum = 0,
			o = {},
			series = [];

		data.forEach(function (item, index, array) {
			if (date.indexOf(item.date) == -1) {
				date.push(item.date);
				daysum.push(sum);
				sum = 0;
			}
			sum += item.price;
		})
		daysum.push(sum);
		daysum.shift();

		series.push({name: '当日消费',type: 'line',data: daysum});

		var option = deepCopy(options.line);
		option.legend.data = legend;
		option.xAxis.data = date;
		option.series = series;

		return option;
	},
	categoryPie: function (data) {
		if (data.length == 0) {
			return 'noDataOption';
		}
		var pie = {},
			legend = [],
			series = [];

		data.forEach(function (o, index, array) {
			if (o.category == null) {
				o.category = '不填';
			}
			if (pie[o.category] == undefined) {
				pie[o.category] = o.price;
			} else {
				pie[o.category] += o.price;
			}
		});

		for (var key in pie) {
			legend.push(key);
			series.push({name: key, value: pie[key]});
		}

		var option = deepCopy(options.pie);
		option.legend.data = legend;
		option.series[0].data = series;
		return option;
	},
	categoryList: function (data) {
		if (data.length == 0) {
			return [];
		}
		var pie = {},
			series = [];

		data.forEach(function (o, index, array) {

			if (o.category == null) {
				o.category = '不填';
			}

			if (pie[o.category] == undefined) {
				pie[o.category] = o.price;
			} else {
				pie[o.category] += o.price;
			}
		});


		for (var key in pie) {

			if (series[0] == undefined){
				series.push({
					name: key,
					value: pie[key]
				});
			} else {
				for (var i = 0; i < series.length; i++) {
					if (series[i].value < pie[key]) {
						break
					} else {
						continue
					}
				}
				series.splice(i,0,{
					name: key,
					value: pie[key]
				})
			}
		}
		return series;
	},
	paywayList: function (data) {
		var pie = {},
			series = [];

		data.forEach(function (o, index, array) {
			if (o.payway == null) {
				o.payway = '不填';
			}
			if (pie[o.payway] == undefined) {
				pie[o.payway] = o.price;
			} else {
				pie[o.payway] += o.price;
			}
		});


		for (var key in pie) {

			if (series[0] == undefined){
				series.push({
					name: key,
					value: pie[key]
				});
			} else {
				for (var i = 0; i < series.length; i++) {
					if (series[i].value < pie[key]) {
						break
					} else {
						continue
					}
				}
				series.splice(i,0,{
					name: key,
					value: pie[key]
				})
			}
		}
		return series;
	},
	paywayPie: function (data) {
		if (data.length == 0) {
			return 'noDataOption';
		}
		var pie = {},
			legend = [],
			series = [];

		data.forEach(function (o, index, array) {
			if (o.payway == null) {
				o.payway = '不填';
			}
			if (pie[o.payway] == undefined) {
				pie[o.payway] = o.price;
			} else {
				pie[o.payway] += o.price;
			}
		});

		for (var key in pie) {
			legend.push(key);
			series.push({name: key, value: pie[key]});
		}

		var option = deepCopy(options.pie);
		option.legend.data = legend;
		option.series[0].data = series;
		return option;
	},
	categoryRadar: function (data) {


		if (data.length == 0) {
			return 'noDataOption';
		}
		var pie = {}, sum = 0;

		data.forEach(function (o, index, array) {
			sum += o.price;
			if (o.category == null) {
				o.category = '不填';
			}
			if (pie[o.category] == undefined) {
				pie[o.category] = o.price;
			} else {
				pie[o.category] += o.price;
			}
		});


		var large = 0, largeName = '';

		for (var key in pie) {
			if (pie[key] > large) {
				large = pie[key];
				largeName = key;
			}
		}

		var indicator = [],value = [];

		for (var key in pie) {
			indicator.push({
				name: key,
				max: large
			});
			value.push(pie[key]);
		}


		var option = deepCopy(options.radar);

		option.radar.indicator = indicator;
		option.series[0].data[0].value = value;

		option.otherMsg = {
			length: indicator.length,
			largeName: largeName,
			persent: Math.round(pie[largeName]/sum*10000)/100
		}

		return option;
	},
	fourPie: function (data) {

		if (data.length == 0) {
			return 'noDataOption';
		}
		var pie = {}, sum = 0;

		data.forEach(function (o, index, array) {
			sum += o.price;
			if (o.category == null) {
				o.category = '不填';
			}
			if (pie[o.category] == undefined) {
				pie[o.category] = o.price;
			} else {
				pie[o.category] += o.price;
			}
		});



		var option = deepCopy(options.fourPie);

		option.series[0].data[0].value = pie['服饰'] || 0;
		option.series[0].data[1].value = sum - (pie['服饰'] || 0);

		option.series[2].data[0].value = pie['饮食'] || 0;
		option.series[2].data[1].value = sum - (pie['饮食'] || 0);
		
		option.series[4].data[0].value = pie['住宿'] || 0;
		option.series[4].data[1].value = sum - (pie['住宿'] || 0);
		
		option.series[6].data[0].value = pie['交通'] || 0;
		option.series[6].data[1].value = sum - (pie['交通'] || 0);

		option.otherMsg = {
			'服饰': pie['服饰'] || 0,
			'饮食': pie['饮食'] || 0,
			'住宿': pie['住宿'] || 0,
			'交通': pie['交通'] || 0,
			'总数': sum
		}

		return option;
	},
	abar: function (data) {
		var sum = 0;
		var food = 0;
		data.forEach(function (o, index, array) {
			sum += o.price;
			if (o.category == '饮食') {
				food += o.price;
			}
		});

		var option = deepCopy(options.abar);
		option.series[0].data[0] = Math.round(food/sum*10000)/100;
		return option;
	},
	dayBar: function (data) {

		if (data.length == 0) {
			return 'noDataOption';
		}
		var legendObject = {},
			date = [],
			legend = [],
			series = [];

		data.forEach(function (o, index, array) {
			if (o.category == null) {
				o.category = '不填';
			}
			if (legendObject[o.category] == undefined) {
				legendObject[o.category] = [];
			}
			if (date.indexOf(o.date) == -1) {
				date.push(o.date);
			}
		});

		data.forEach(function (o, index, array) {

			var dateIndex = date.indexOf(o.date);

			if (legendObject[o.category][dateIndex] == undefined) {
				legendObject[o.category][dateIndex] = o.price;
			} else {
				legendObject[o.category][dateIndex] += o.price;
			}

		});

		for(var key in legendObject) {
			legend.push(key);
			series.push({
				name: key,
				type: 'bar',
				stack: '总量',
				data: legendObject[key]
			})
		}


		var option = deepCopy(options.groupBar);

		option.legend.data = legend;
		option.xAxis.data = date;
		option.series = series;

		return option;
	}
}