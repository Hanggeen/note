<template>
	<div>
		<div v-show="showOneDate == false" class="date-range">
			日期：
			<div ref="startDate" class="date">{{startDate}}</div>
			<span style="color:#999">-</span>
			<div ref="endDate" class="date">{{endDate}}</div>
			<button v-on:click="recent(6, true)"  v-bind:class="{'active-btn': rangeStatus == 6}" class="btn btn-refresh">最近7天</button>
			<button v-on:click="recent(14, true)" v-bind:class="{'active-btn': rangeStatus == 14}" class="btn btn-refresh">最近15天</button>
			<button v-on:click="recent(29, true)" v-bind:class="{'active-btn': rangeStatus == 29}" class="btn btn-refresh">最近30天</button>
			<button v-on:click="recent(59, true)" v-bind:class="{'active-btn': rangeStatus == 59}" class="btn btn-refresh">最近60天</button>
			<a v-on:click="shift(false)" class="shift" v-if="onedate">切换为单日</a>
		</div>
		<div  v-show="showOneDate == true" class="one-date">
			日期：
			<div ref="aDate" class="date">{{aDate}}</div>
			<button v-on:click="recent(0, false)"  v-bind:class="{'active-btn': dateStatus == 0}" class="btn btn-refresh">今天数据</button>
			<button v-on:click="recent(1, false)" v-bind:class="{'active-btn': dateStatus == 1}" class="btn btn-refresh">昨天数据</button>
			<button v-on:click="recent('previous', false)" class="btn btn-refresh">前一天</button>
			<button v-on:click="recent('next', false)" v-bind:class="{'not-allowed': dateStatus == 0}" class="btn btn-refresh">后一天</button>
			<a v-on:click="shift(true)" class="shift">切换为范围</a>
		</div>
	</div>
</template>

<script type="text/javascript">
	var calender = require('../modules/calender.js');
	var eventHub = require('./eventHub.js');

	module.exports = {
		props: {
			config: {
				type: Object
			},
			onedate: {
				type: Boolean
			}
		},
		data: function () {
			return {
				startDate: this.config.startDate,
				endDate: this.config.endDate,
				aDate: this.config.oneDate,
				showOneDate: this.onedate,
				startExa: null,
				endExa: null,
				aDateExa: null
			}
		},
		computed: {
			/*计算属性，记录已选择的两个日期的范围，用于显示高亮按钮*/
			rangeStatus: function () {
				var startDate = this.startDate,
					endDate = this.endDate,
					num;
				if (endDate != this.getTodayDate()) {
					return false;
				} else {
					num = (new Date(endDate.replace(/-/g, "/")) - new Date(startDate.replace(/-/g, "/")))/(24*3600*1000);
					return num;
				}
			},
			/*计算属性，记录已选择日期距离今天的日数，用于显示高亮按钮*/
			dateStatus: function () {
				var aDate = this.aDate,
					today = this.getTodayDate(),
					num = (new Date(today.replace(/-/g, "/")) - new Date(aDate.replace(/-/g, "/")))/(24*3600*1000);
				return num;
			}
		},
		watch: {
			/*监听开始日期，改变则更新echart，并改变结束日期组件的最小开始时间*/
			startDate: function () {
				var self = this;
				self.refresh('range');
				self.endExa.setMin(self.startDate.split('-'));
			},
			/*监听结束日期，改变则更新echart，并改变开始日期组件的最大结束时间*/
			endDate: function () {
				var self = this;
				self.refresh('range');
				self.startExa.setMax(self.endDate.split('-'));
			},
			/*监听单个日期，改变则更新echart*/
			aDate: function () {
				this.refresh('one');
			}
		},
		methods: {
			shift: function (isRange) {
				var self = this;
				if (isRange) {
					self.showOneDate = false;
					eventHub.$emit("refresh",{
						startDate: self.startDate,
						endDate: self.endDate
					})
				} else {
					self.showOneDate = true;
					eventHub.$emit("refresh",{
						startDate: self.aDate,
						endDate: self.aDate
					})
				}
			},
			/*传入数量，设置单个日期或者日期范围*/
			recent: function (num, isRange) {
				if (typeof num == 'string') {
					if (num == 'previous') {
						var today = this.aDate,
							moment = new Date(today.replace(/-/g, "/")),
							target = new Date(moment - (24*3600*1000));
						target = this.format(target);
						if (isRange) {
							this.startDate = target;
							this.endDate = today;
							this.startExa.set(target);
							this.endExa.set(today);
						} else {
							this.aDate = target;
							this.aDateExa.set(target);
						}
					} else {
						var today = this.aDate,
							moment = new Date(today.replace(/-/g, "/")),
							target = new Date(moment - (-24*3600*1000));
						target = this.format(target);
						if (this.dateStatus == 0) {
						} else {
							this.aDate = target;
							this.aDateExa.set(target);
						}
					}
				} else {
					var today = this.getTodayDate(),
						moment = new Date(today.replace(/-/g, "/")),
						target = new Date(moment - num * (24*3600*1000));
					target = this.format(target);
					if (isRange) {
						this.startDate = target;
						this.endDate = today;
						this.startExa.set(target);
						this.endExa.set(today);
					} else {
						this.aDate = target;
						this.aDateExa.set(target);
					}
				}


			},
			/*根据传入参数，并更新config的时间*/
			refresh: function (kind) {
				var self = this;
				if (kind == "range") {
					eventHub.$emit("refresh",{
						startDate: self.startDate,
						endDate: self.endDate
					})
				} else if (kind == "one") {
					eventHub.$emit("refresh",{
						startDate: self.aDate,
						endDate: self.aDate
					})
				} else {
					console.error("没有对应refresh类型");
				}
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
			getTodayDate: function () {
				var date = new Date();
				return this.format(date);
			}
		},
		mounted: function () {

			var self = this;
			
			var start = '2017-01-01';

			/*开始日期日历插件初始化*/
			calender(self.$refs.startDate).init({
				date : self.startDate.split("-"),  
				format : 'yyyy-MM-dd',
				button : false,
				left : 0,
				top :0,
				onload : function(context){
					self.startExa = context;
					context.setMin(start.split('-'));
					context.setMax(self.endDate.split('-'));
				} 
			},function(date){
				self.startDate = date;
			});

			/*结束日期日历插件初始化*/
			calender(self.$refs.endDate).init({
				date : self.endDate.split("-"),  
				format : 'yyyy-MM-dd',
				button : false,   
				left : 0,
				top :0, 
				onload : function(context){
					self.endExa = context;
					context.setMin(self.startDate.split('-'));
					context.setMax(self.getTodayDate().split('-'));
				} 
			},function(date){    
				self.endDate = date;
			});

			/*单个日期日历插件初始化*/
			calender(self.$refs.aDate).init({
				date : self.aDate.split("-"),  
				format : 'yyyy-MM-dd',
				button : false,   
				left : 0,
				top :0, 
				onload : function(context){
					self.aDateExa = context;
					// context.setMin(config.startStart.split('-'));
					// context.setMax(config.endEnd.split('-'));
				} 
			},function(date){ 
				self.aDate = date;	
			});


		}
	};

</script>


<style scoped>

.date-range, .one-date{
  text-align: left;
}

.date-range  > * , .one-date > *{
  text-align: left;
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
}
.btn-refresh, .date{
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}
.date-range .btn-refresh{
  margin: 0 10px;
}
.one-date .btn-refresh{
  margin: 0 10px;
}
.date-range .btn{
  margin-left: 10px;
}
.date-range .btn:hover{
  background-color: #23acf1;
  color: #fff;
  border: 1px solid #23acf1;
}
.one-date .btn:hover{
  background-color: #23acf1;
  color: #fff;
  border: 1px solid #23acf1;
}
.date-range > .active-btn, .one-date > .active-btn{
  background-color: #23acf1;
  color: #fff;
  border: 1px solid #23acf1;
}
.not-allowed{
	cursor: not-allowed !important;
}
.btn-logout > .icon{
  margin-right: 5px;
  color: #666;
}


.btn-logout{
  cursor: pointer;
  display: inline-block;
  width: 100px;
  color: #666;
  background-color: rgba(0,0,0,0);
  border: 0px;
  text-align: center;
  vertical-align: middle;
}
.btn-logout:hover{
  color: #333;
}

.shift{
	cursor: pointer;
}

</style>