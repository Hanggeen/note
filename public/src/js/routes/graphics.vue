<template>
	<div class="content bottomgap">
		<div class="content-title">
			<p>报表 | Report Form</p>
		</div>
		<div class="graphics-frame">
			<date-range :onedate="false" :config="date"></date-range>
		</div>
		<div>
			<div class="cube" style="background-color:#C23531">
				<div class="cube-title"><p>累计消费金额</p></div>
				<div class="cube-content"><h1>${{sum}}</h1></div>
			</div>
			<div class="cube" style="background-color:#D48265">
				<div class="cube-title"><p>最高消费</p></div>
				<div class="cube-content" style="margin-top:25px;"><h1 style="font-size:20px;">{{highestNote}}</h1></div>
			</div>
			<div class="cube" style="background-color:#91C7AE;vertical-align:top;">
				<div class="cube-title"><p>统计天数</p></div>
				<div class="cube-content"><h1>{{dayNum}} <span style="font-size:14px;"> 天</span></h1></div>
			</div>
			<div class="cube" style="background-color:#CA8622">
				<div class="cube-title"><p>累计消费笔数</p></div>
				<div class="cube-content"><h1>{{quantity}} <span style="font-size:14px;"> 笔</span></h1></div>
			</div>
		</div>

		<echart :config="categoryPie"></echart>
		<div class="category-list">
			<div class="category-list-title">
				消费类型排行
			</div>
			<div v-if="categoryList.length == 0">
				<p style="text-align:center;margin-top:120px;">暂无数据</p>
			</div>
			<div v-else class="list-content">
				<div v-for="(item,index) in categoryList" class="list-row">{{index+1}}. {{item.name}}  {{item.value}}
				<span style="float:right">{{Math.floor(item.value/sum*100)}}%</span></div>
			</div>

		</div>
		<br/>	
		<echart :config="paywayPie"></echart>
		<div class="category-list">
			<div class="category-list-title">
				消费类型排行
			</div>
			<div v-if="paywayList.length == 0">
				<p style="text-align:center;margin-top:120px;">暂无数据</p>
			</div>
			<div v-else class="list-content">
				<div v-for="(item,index) in paywayList" class="list-row">{{index+1}}. {{item.name}}  {{item.value}}
				<span style="float:right">{{Math.floor(item.value/sum*100)}}%</span></div>
			</div>

		</div>
		<br/>	
		<echart :config="monthLine"></echart>
		<br/>	
		<echart :config="dayBar"></echart>
	</div>
</template>

<script type="text/javascript">
	var Echart = require('../components/Echart.vue');
	var eventHub = require('../components/eventHub.js');
	var compute = require('../modules/compute.js');
	var DateRange = require('../components/DateRange');
	module.exports = {
		data: function(){
			return {
				showOneDate: {
					value: false
				},
				date: {
					startDate: this.getTodayDate(-6),
					endDate: this.getTodayDate(),
					oneDate: this.getTodayDate()
				},
				bill: [],
				sum: 0,
				highestNote: ' ',
				dayNum: 0,
				quantity: 0,
				categoryList: [],
				paywayList: [],
				monthLine: {
					title: '每日消费总和趋势',
					width: 902,
					height: 300,
					option: 'showLoading'
				},
				categoryPie: {
					title: '消费种类占比',
					width: 672,
					height: 300,
					option: 'showLoading'
				},
				paywayPie: {
					title: '支付方式占比',
					width: 672,
					height: 300,
					option: 'showLoading'
				},
				dayBar: {
					title: '每日消费与占比',
					width: 902,
					height: 500,
					option: 'showLoading'
				}
			}
		},
		components: {
			'echart': Echart,
			'date-range': DateRange
		},
		watch: {
		},
		methods: {
			'render': function () {
				var self = this;
            	this.categoryPie.option = compute.categoryPie(self.bill);
            	this.paywayPie.option = compute.paywayPie(self.bill);
            	this.monthLine.option = compute.monthLine(self.bill);
            	this.dayBar.option = compute.dayBar(self.bill);
            	this.categoryList = compute.categoryList(self.bill);
            	this.paywayList = compute.paywayList(self.bill);
            	// this.monthBar.option = config.monthBar.compute(self.bill);
            	this.sum = compute.sum(self.bill);
            	this.dayNum = compute.dayNum(self.bill);
            	this.highestNote = compute.highestNote(self.bill);
            	this.quantity = self.bill.length;
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
				return this.format(date);
			},
			fetchBill: function (date) {
				var self = this;
				window.ajax.simpost('/api/fetchBill', {
					startDate: date.startDate,
					endDate: date.endDate
				}, function (error, result) {
					if (result.errorCode == 0) {
						self.bill = result.result;
						self.render();
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
				startDate: self.getTodayDate(-6),
				endDate: self.getTodayDate()
			}, function (error, result) {
				if (result.errorCode == 0) {
					self.bill = result.result;
					self.render();
				} else {
					swal("加载失败","请检查您的网络","error");
				}
			})


		}
	};

</script>

<style type="text/css">
.bottomgap{
	margin-bottom: 200px;
}

.content{
	padding: 0px 30px;
}
.content-title{
	margin-bottom: 20px;
	font-size: 17px;
	color: #666;
	border-bottom: 1px solid #aaa;
}

.cube{
	display: inline-block;
	margin: 10px 0px;
	margin-right: 20px;
	padding: 0px 10px;
	width: 188px;
	height: 100px;
	color: #fff;
	background-color: #FFC125;
	overflow: hidden;
}
.cube-content > h1{
	margin: 0px;
	text-align: right;
	font-size: 35px;
}


.progress-bar{
	display: inline-block;
	margin: 10px 0px;
	width: 800px;
	height: 26px;
	padding: 12px 0px;
	padding-left: 100px;
	background-color: #fff;
}
.bar-container{
	padding: 3px 3px;
	width: 750px;
	background-color: #2F4554;
	height: 20px;
	border-radius: 20px;
	line-height: 20px;
}
.bar-content{
	width: 400px;
	height: 20px;
	background-color: #61A0A8;
	border-radius: 10px;
}
.bar-title{
	float: left;
	position: relative;
	left: -100px;
	width: 100px;
	height: 30px;
	color: #333;
	text-align: center;
	line-height: 26px;
}

.category-list{
	position: relative;
	top: 10px;
	box-sizing: border-box;
	padding: 0px 20px;
	vertical-align: top;
	display: inline-block;
	width: 208px;
	height: 349px;
	background-color: #fff;
	overflow: hidden;
}


.category-list-title{
	height: 49px;
	line-height: 49px;
}

.list-row{
	border-top: 1px solid #eee;
	color: #FF2D2D;
	font-size: 15px;
	height: 40px;
	line-height: 40px;
}

.category-list > .list-content > .list-row:nth-child(1){
	font-weight: 700;
	color: #CE0000;
}
.category-list > .list-content > .list-row:nth-child(2){
	color: #EA0000;
}
.category-list > .list-content > .list-row:nth-child(3){
	color: #FF0000;
}


.graphics-frame{
	margin-bottom: 20px;
	box-sizing: border-box;
	padding: 20px 20px;
	width: 900px;
	background-color: #fff;
}

</style>