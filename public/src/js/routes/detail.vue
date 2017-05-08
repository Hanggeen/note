<template>
	<div class="content">
		<div class="content-title">
			<p>明细 | Detail</p>
		</div>
		<div class="detail-filter">
			<div class="filter-frame" style="display:block;margin-bottom:30px;">
				<date-range :config="date" :onedate="true"></date-range>
			</div>
			<div class="filter-frame">
				<label>关键词</label>
				<input class="keyword" v-model="filter.keyword" placeholder="填入名称所带字词...">
			</div>
			<div class="filter-frame gap">
				<label>种类</label>
				<select v-model="filter.category">
					<option>全部</option>
					<option v-for="(item, index) in config.category">{{index}}</option>
				</select>
			</div>
			<div class="filter-frame gap">
				<label>类型</label>
				<select v-model="filter.sort">
					<option>全部</option>
					<option v-for="item in config.category[filter.category]">{{item}}</option>
				</select>
			</div>
			<div class="filter-frame gap">
				<label>方式</label>
				<select v-model="filter.payway">
					<option>全部</option>
					<option v-for="item in config.payway">{{item}}</option>
				</select>
			</div>
			<div class="filter-frame gap">
				<label>项目</label>
				<select v-model="filter.project">
					<option>全部</option>
					<option v-for="item in config.project">{{item}}</option>
				</select>
			</div>
			<div class="filter-frame gap">
				<label>角色</label>
				<select v-model="filter.role">
					<option>全部</option>
					<option v-for="item in config.role">{{item}}</option>
				</select>
			</div>
		</div>
		<div class="detail-container">
			<table class="detail">
				<thead>
					<tr>	
						<th>日期</th>
						<th>名称</th>
						<th>种类</th>
						<th>类型</th>
						<th>价格</th>
						<th>方式</th>
						<th>项目</th>
						<th>角色</th>
						<th></th>
					</tr>
				</thead>
				<tbody v-if="!loading">
					<tr v-for="o in bill">
						<td>{{o.date}}</td>
						<td>{{o.note}}</td>
						<td>{{o.category}}</td>
						<td>{{o.sort}}</td>
						<td>{{o.price}}</td>
						<td>{{o.payway}}</td>
						<td>{{o.project}}</td>
						<td>{{o.role}}</td>
						<td><button v-on:click="deleteDetail(o.id)" class="detail-delete">删除</button></td>
					</tr>
				</tbody>

			</table>			
		</div>
		<p v-if="loading" style="text-align:center">加载中...</p>
		<p v-show="bill.length == 0" style="text-align:center">暂无数据</p>
	</div>
</template>

<script type="text/javascript">
	var calender = require('../modules/calender.js');
	var eventHub = require('../components/eventHub.js');
	var DateRange = require('../components/DateRange');

	module.exports = {
		data: function(){
			return {
				loading: true,
				date: {
					startDate: this.getTodayDate(-6),
					endDate: this.getTodayDate(),
					oneDate: this.getTodayDate()
				},
				config: {
					category: [],
					sort: null,
					payway: null,
					project: null,
					role: null
				},
				allbill: null,
				bill: [],
				filter: {
					category: '全部',
					sort: '全部',
					payway: '全部',
					project: '全部',
					role: '全部',
					keyword: ''
				}
			}
		},
		components: {
			'date-range': DateRange
		},
		watch: {
			'filter.category': function () { this.filter.sort = '全部';this.render();},
			'filter.sort': function () { this.render();},
			'filter.payway': function () { this.render();},
			'filter.project': function () { this.render();},
			'filter.role': function () { this.render();},
			'filter.keyword': function () { this.render();}
		},
		methods: {
			'render': function () {
				var self = this;
				var bill = [];
				self.allbill.forEach(function (item, index, array) {
					console.log(self.filter.category == null);


					// if (self.filter.category == '全部' || self.filter.category == item.category) {
					// 	if (self.filter.keyword == '' || item.note.indexOf(self.filter.keyword) != -1) {
					// 		bill.push(item);
					// 	}
					// }

					if (self.filter.category != '全部' && self.filter.category != item.category);
					else if (self.filter.sort != '全部' && self.filter.sort != item.sort);
					else if (self.filter.payway != '全部' && self.filter.payway != item.payway);
					else if (self.filter.project != '全部' && self.filter.project != item.project);
					else if (self.filter.role != '全部' && self.filter.role != item.role);
					else if (self.filter.keyword != '' && item.note.indexOf(self.filter.keyword) == -1);
					else { bill.push(item)}


				});
				this.bill = bill;
			},
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
				console.log(date);
				console.log(this.format(date));
				return this.format(date);
			},
			fetchBill: function (date) {
				var self = this;
				window.ajax.simpost('/api/fetchBill', {
					startDate: date.startDate,
					endDate: date.endDate
				}, function (error, result) {
					if (result.errorCode == 0) {
						console.log(result);
						self.bill = result.result;
						self.allbill = result.result;
						self.loading = false;
						self.render();
					} else {
						swal("加载失败","请检查您的网络","error");
					}
				})
			},
			deleteDetail: function (id) {
				var self = this;
				window.ajax.simpost('/api/deleteDetail', {
					id: id
				}, function (error, result) {
					if (result.errorCode == 0) {
						swal("","","success");


						window.ajax.simpost('/api/fetchBill', {
							startDate: self.date.startDate,
							endDate: self.date.endDate
						}, function (error, result) {
							if (result.errorCode == 0) {
								console.log(result);
								self.bill = result.result;
								self.allbill = result.result;
								self.loading = false;
								self.render();
							} else {
								swal("加载失败","请检查您的网络","error");
							}
						})


					} else {
						swal("加载失败","请检查您的网络","error");
					}
				})
			}
		},
		/*创建时绑定事件*/
		created: function () {
  			eventHub.$on('refresh', this.fetchBill);
		},
		/*最好在组件销毁前，清除事件监听*/
		beforeDestroy: function () {
  			eventHub.$on('refresh', this.fetchBill);
		},
		mounted: function () {
			var self = this;

			window.ajax.simpost('/api/fetchBill', {
				startDate: self.date.oneDate,
				endDate: self.date.oneDate
			}, function (error, result) {
				if (result.errorCode == 0) {
					console.log(result);
					self.bill = result.result;
					self.allbill = result.result;
					self.loading = false;
					self.render();
				} else {
					swal("加载失败","请检查您的网络","error");
				}
			})


			window.ajax.simpost('/api/fetchConfig',function (error, result) {
				if (result.errorCode == 0) {
					self.config = result.result;
				} else {
					swal("加载失败","请检查您的网络","error");
				}
			})



		}
	};

</script>

<style type="text/css">

.detail-filter{
	margin-bottom: 20px;
	padding: 20px 20px 40px 20px;
	font-size: 13px;
	box-sizing: border-box;
	width: 100%;
	background-color: #fff;
}

.filter-frame{
	display: inline-block;
}

.filter-frame > select {
	height: 36px;
    border-radius: 5px;
    border-color: #ddd;
    padding: 0px 3px;
}

.keyword{

	height: 36px;
	border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0px 10px;
}

.gap{
	margin-left: 20px;
}


.detail-container{
	padding: 0px 10px;
	background-color: #fff;
}

.detail{
	margin-bottom: 100px;
	width: 100%;
	border-spacing: 0;
    border-collapse: collapse;
}
.detail td,.detail th{
	padding: 10px;
	font-size: 14px;
	border: 0px;
	text-align: left;
}
.detail >tbody>tr:nth-of-type(odd){
	background-color: #f9f9f9;
}




.date{
  margin: 0px 5px;
  padding: 0px 10px;
  padding-left: 40px;
  width: 70px;
  height: 34px;
  color: #333;
  font-size: 13px;
  line-height: 34px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  background: url(../../images/calend.png) no-repeat 10px 6px;
  background-size: 20px 20px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}


.detail-delete{
	cursor: pointer;
	padding: 4px 6px;
	border-radius: 4px;
	color: #fff;
	background-color: transparent;
	border: 0px;
	background-color: #F08080;
}
.detail-delete:hover{
	background-color: #EE2C2C;
}


</style>