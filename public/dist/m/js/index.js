var app = new Vue({
	el: '#app',
	data: function (){
		return {
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
			bill: []
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

		},
		'renderUser': function () {

		}
	},
	mounted: function () {
		var self = this;
		this.fetchConfig();
		this.renderRecord();
	}
})