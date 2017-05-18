var app = new Vue({
	el: '#app',
	data: function (){
		return {
			name: '',
			recordSaveBtn: true,
			custom: {
				date: this.getTodayDate(),
				note: null,
				price: null,
				category: null,
				sort: null,
				payway: null,
				project: null,
				role: null
			},
			config: {
				category: {}
			},
			active: 'record',
			bill: [],
			message: {
				sum: 0,
				highestNote: '',
				dayNum: 0,
				quantity: 0
			}
		}
	},
	watch: {
		'active': function (newVal, oldVal) {
			if (newVal == 'record') {
				this.renderRecord();
			} else if (newVal == 'detail') {
				this.renderDetail();
			} else if (newVal == 'report') {
				this.renderReport();
			} else if (newVal == 'user') {
				this.renderUser();
			} else {

			}
		},
		'custom.category': function (newVal, oldVal) {
			this.custom.sort = null;
		}
	},
	methods: {			
		/*格式化时间，把date对象变成yyyy-mm-dd格式*/
		format: function (date) {
			var date = new Date(date),
			y = String(date.getFullYear()),
			m = date.getMonth(),
			d = String(date.getDate());
			m++;
			if(m<10){m="0"+String(m)};
			if(d<10){d="0"+String(d)};
			return y+"-"+m+"-"+d;
		},
		/*获取今天日期，返回yyyy-mm-dd格式*/
		getTodayDate: function (num) {
			var date = new Date();
			if (num == undefined) {
				num = 0;
			}
			date = date.valueOf() + (num*3600*24*1000);
			return this.format(date);
		},
		'fetchConfig': function () {
			var self = this;
			window.ajax.simpost('/api/fetchConfig',function (error, result) {
				if (result.errorCode == 0) {
					self.config = result.result;
				} else {
					swal("加载失败","请检查您的网络","error");
				}
			})
		},
		'jump': function (route) {
			this.active = route;
		},
		'recordSave': function () {	
			var self = this;
			if (self.custom.note == null) {
				swal("","备注不能为空哦~","error");
			} else if (self.custom.price == "" || self.custom.price == null) {
				swal("","价格不能为空哦~","error");
			} else if (Number(self.custom.price) == NaN) {
				swal("","价格要为数值哦~","error");
			} else {
				window.ajax.simpost('/api/record', self.custom, function (error, result) {
					if (result.errorCode == 0) {
						swal("保存成功","一条记录已插入","success");
						self.custom.note = null;
						self.custom.price = null;
						self.custom.category = null;
						self.custom.sort = null;
						self.custom.payway = null;
						self.custom.project = null;
						self.custom.role = null;
					} else {
						swal("保存失败",result.errorCode,"error");
					}
				})
			}

		},
		'showDetail': function (index) {
			swal({
				html:
				'<div style="text-align:left">' + 
				'<label>日期：</label>' + this.bill[index].date + "<br/>" + 
				'<label>备注：</label>' + this.bill[index].note + "<br/>" + 
				'<label>价格：</label>' + this.bill[index].price + "<br/>" + 
				'<label>种类：</label>' + this.bill[index].category + "<br/>" + 
				'<label>类型：</label>' + this.bill[index].sort + "<br/>" + 
				'<label>支付：</label>' + this.bill[index].payway + "<br/>" + 
				'<label>项目：</label>' + this.bill[index].project + "<br/>" + 
				'<label>角色：</label>' + this.bill[index].role + "<br/>" + 
				'</div>'
			})
		},		
		'deleteDetail': function (id, index) {
			var self = this;
			swal({
				text:  '确定删除"' + self.bill[index].note + '"？',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: '删除',
				cancelButtonText: '取消',
			},function(isConfirm) {
				if (isConfirm) {
					window.ajax.simpost('/api/deleteDetail', {
						id: id
					}, function (error, result) {
						if (result.errorCode == 0) {
							window.ajax.simpost('/api/fetchBill', {
								startDate: '2017-01-01',
								endDate: self.getTodayDate()
							}, function (error, result) {
								if (result.errorCode == 0) {
									self.bill = result.result.reverse();
								} else {
									swal("加载失败","请检查您的网络","error");
								}
							})
							swal("","删除成功","success");

						} else {
							swal("加载失败","请检查您的网络","error");
						}
					})
				}
			})
		},
		/*退出当前账户*/
		'logout': function () {
			swal({
				text: '确定退出当前账户？',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: '退出',
				cancelButtonText: '取消'
			},function(isConfirm) {
				if (isConfirm) {
					window.ajax.simpost('/api/logout',function (error, result) {
						if (result.errorCode == 0) {
							window.location.href="./login.html"; 
						}
					})
				}
			});
		},
		'renderRecord': function () {
			var self = this;
			self.$nextTick(function () {
				console.log(self.$refs.recordDate);
				/*开始日期日历插件初始化*/
				calender(self.$refs.recordDate).init({
					date : self.custom.date.split("-"), 
					format : 'yyyy-MM-dd',
					button : false,
					left : 0,
					top :0,
					onload : function(context){
						context.setMin([2017,1,1]);
						context.setMax(self.getTodayDate().split('-'));
					} 
				},function(date){
					self.custom.date = date;
				});
			})
		},
		'renderDetail': function () {
			var self = this;

			window.ajax.simpost('/api/fetchBill', {
				startDate: '2017-01-01',
				endDate: self.getTodayDate()
			}, function (error, result) {
				if (result.errorCode == 0) {
					self.bill = result.result.reverse();
				} else {
					swal("加载失败","请检查您的网络","error");
				}
			})
		},
		'renderReport': function () {
			var self = this;
			self.$nextTick(function () {
				window.ajax.simpost('/api/fetchBill', {
					startDate: '2017-01-01',
					endDate: self.getTodayDate()
				}, function (error, result) {
					if (result.errorCode == 0) {
						self.bill = result.result;
						self.renderMessage();
						self.renderPie();
						self.renderLine();
						self.renderBar();
					} else {
						swal("加载失败","请检查您的网络","error");
					}
				})

			});
		},
		renderMessage: function () {

			var self = this;
			var data = self.bill;

			var sum = 0;
			data.forEach(function (o, index, array) {
				sum += o.price
			});
			self.message.sum = sum;


			if (data.length == 0) {
				self.message.highestNote = '无';
			} else {
				var highest = {
					price: -2
				}
				data.forEach(function (o, index, array) {
					if (o.price > highest.price) {
						highest = o;
					}
				});
				self.message.highestNote = highest.note;
			}


			var date = '';
			var num = 0;
			data.forEach(function (o, index, array) {
				if (o.date != date) {
					num ++;
					date = o.date;
				}
			});
			self.message.dayNum = num;

			self.message.quantity = data.length;




		},
		'renderUser': function () {
			var self = this;
            window.ajax.simpost('/api/fetchUser',function (error, result) {
                self.name = result.result.name;

            })
		},
		'renderPie': function () {
			var self = this;

			// 基于准备好的dom，初始化echarts实例
			var dom = document.getElementById('chartPie')
            dom.style.width = (window.screen.width - 40) + 'px';
            dom.style.height = (window.screen.width - 40) + 'px';
            var myChart = echarts.init(dom);

            if (self.bill.length == 0) {
                myChart.clear();
                myChart.showLoading({
                    text: '暂无数据',
                    color: 'rgba(255, 255, 255, 0)',
                    textColor: '#000',
                    maskColor: '#fff',
                    zlevel: 0
                });
            } else {
				var o = {
				    title: {
				        text: '消费种类占比',
				        x:'left',
				        textStyle: {
				            color: '#666',
				            fontSize: '15',
				            fontWeight: '100'
				        }
				    },
				    tooltip: {
				        trigger: 'item',
				        formatter: "{a} <br/>{b}: {c} ({d}%)"
				    },
				    series: [
				        {
				            name:'访问来源',
				            type:'pie',
				            radius: ['30%', '50%'],

				            data:[
				                {value:335, name:'直达'},
				                {value:310, name:'邮件营销'},
				                {value:234, name:'联盟广告'},
				                {value:135, name:'视频广告'},
				                {value:1048, name:'百度'},
				                {value:251, name:'谷歌'},
				                {value:147, name:'必应'},
				                {value:102, name:'其他'}
				            ]
				        }
				    ],
	    			backgroundColor: '#f5f7f9'
				}
				var data = self.bill;
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
				o.series[0].data = series;
	            myChart.setOption(o);
            }
		},
		'renderLine': function () {
			var self = this;

			// 基于准备好的dom，初始化echarts实例
			var dom = document.getElementById('chartLine')
            dom.style.width = (window.screen.width - 40) + 'px';
            dom.style.height = (window.screen.width - 40) + 'px';
            var myChart = echarts.init(dom);

            if (self.bill.length == 0) {
                myChart.clear();
                myChart.showLoading({
                    text: '暂无数据',
                    color: 'rgba(255, 255, 255, 0)',
                    textColor: '#000',
                    maskColor: '#fff',
                    zlevel: 0
                });
            } else {
				var option = {
				    title: {
				        text: '每日消费总和趋势',
				        x:'left',
				        textStyle: {
				            color: '#666',
				            fontSize: '15',
				            fontWeight: '100'
				        }
				    },
				    tooltip: {
				        trigger: 'axis'
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data: []
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: [],
	    			backgroundColor: '#f5f7f9'
				}
				var data = self.bill;
				var legend = ['当日消费'],
					date = [],
					daysum = [],
					sum = 0,
					o = {},
					series = [];

				data.forEach(function (item, index, array) {
					if (date.indexOf(item.date.slice(5)) == -1) {
						date.push(item.date.slice(5));
						daysum.push(sum);
						sum = 0;
					}
					sum += item.price;
				})
				daysum.push(sum);
				daysum.shift();

				series.push({name: '当日消费',type: 'line',data: daysum});

				option.xAxis.data = date;
				option.series = series;
	            myChart.setOption(option);
            }
		},
		'renderBar': function () {
			var self = this;

			// 基于准备好的dom，初始化echarts实例
			var dom = document.getElementById('chartBar')
            dom.style.width = (window.screen.width - 40) + 'px';
            dom.style.height = (window.screen.width - 40) + 'px';
            var myChart = echarts.init(dom);

            if (self.bill.length == 0) {
                myChart.clear();
                myChart.showLoading({
                    text: '暂无数据',
                    color: 'rgba(255, 255, 255, 0)',
                    textColor: '#000',
                    maskColor: '#fff',
                    zlevel: 0
                });
            } else {
				var option = {
				    title: {
				        text: '每日消费与占比',
				        x:'left',
				        textStyle: {
				            color: '#666',
				            fontSize: '15',
				            fontWeight: '100'
				        }
				    }, 
				    tooltip : {
				    	trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				    	bottom: 5,
				    	data: []
				    },
				    grid: {
				    	left: '3%',
				    	right: '4%',
				    	bottom: '20%',
				    	containLabel: true
				    },
				    xAxis:  {
				    	type: 'category',
				    	data: []
				    },
				    yAxis: {
				    	type: 'value'
				    },
				    series: [],
	    			backgroundColor: '#f5f7f9'
				}
				var data = self.bill;

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
					if (date.indexOf(o.date.slice(5)) == -1) {
						date.push(o.date.slice(5));
					}
				});

				data.forEach(function (o, index, array) {

					var dateIndex = date.indexOf(o.date.slice(5));

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

				option.legend.data = legend;
				option.xAxis.data = date;
				option.series = series;


	            myChart.setOption(option);
            }
		}
	},
	mounted: function () {
		var self = this;
		this.fetchConfig();
		this.renderRecord();
	}
})