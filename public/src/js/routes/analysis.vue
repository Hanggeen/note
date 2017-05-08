<template>
	<div class="content">
		<div class="content-title">
			<p>分析 | Analysis</p>
		</div>
		<div class="analysis-body">
			<div class="analysis-row">
				<div class="analysis-text">
					<p><span>恩格尔系数</span>(Engel's Coefficient)是指：</p>
					<p><span>食品支出总额占个人消费支出总额的比重</span></p>
					<p>我的恩格尔系数是 <span>{{engelNum}}%</span></p>
					<p>属于<span>{{engel}}</span></p>
					<p style="font-size:13px;">(大于60%为贫穷；50%-60%为温饱；40%-50%为小康；30%-40%属于相对富裕；20%-30%为富足；20%以下为极其富裕)</p>
				</div>
				<echart :config="abar"></echart>
			</div>
			<div class="analysis-row">
				<echart :config="categoryRadar"></echart>
				<div class="analysis-text">
					<p>我消费的种类数达到<span>{{radarText.length}}种</span></p>
					<p>其中最高的消费是<span>{{radarText.largeName}}</span></p>
					<p>占我所有消费的<span>{{radarText.persent}}%</span></p>
				</div>
			</div>
			<div class="analysis-row">
				<div class="analysis-text">
					<p>我记录的所有消费总数为<span>{{pieData['总数']}}</span>元 ，</p>
					<p>衣食住行总数为 <span>{{pieData['服饰']+pieData['饮食']+pieData['住宿']+pieData['交通']}}</span>元，占我总消费的<span>{{Math.round((pieData['服饰']+pieData['饮食']+pieData['住宿']+pieData['交通'])/pieData['总数']*10000)/100}}%</span></p>
					<p>其中服饰 <span>{{pieData['服饰']}}</span>元，占<span>{{Math.round(pieData['服饰']/pieData['总数']*10000)/100}}%</span></p>
					<p>饮食 <span>{{pieData['饮食']}}</span>元，占<span>{{Math.round(pieData['饮食']/pieData['总数']*10000)/100}}%</span></p>
					<p>住宿 <span>{{pieData['住宿']}}</span>元，占<span>{{Math.round(pieData['住宿']/pieData['总数']*10000)/100}}%</span></p>
					<p>交通 <span>{{pieData['交通']}}</span>元，占<span>{{Math.round(pieData['交通']/pieData['总数']*10000)/100}}%</span></p>
				</div>
				<echart :config="fourPie"></echart>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	var Echart = require('../components/Echart.vue');
	var compute = require('../modules/compute.js');
	module.exports = {
		data: function(){
			return {
				bill: null,
				engelNum: 0,
				engel: '',
				pieData: {},
				radarText: {
					length: 0,
					largeName: '',
					persent: 0
				},
				categoryRadar: {
					title: '',
					width: 450,
					height: 300,
					option: 'showLoading'
				},
				fourPie: {
					title: '',
					width: 450,
					height: 300,
					option: 'showLoading'
				},
				abar: {
					title: '',
					width: 450,
					height: 300,
					option: 'showLoading'
				}
			}
		},
		components: {
			'echart': Echart
		},
		watch: {
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
						self.render();
					} else {
						swal("加载失败","请检查您的网络","error");
					}
				})
			},
			'renderEngel': function (option) {
            	var engel = (option.series[0].data[0]);
            	this.engelNum = engel;
            	if (engel < 20) {
            		this.engel = '极其富裕';
            	} else if (engel < 30) {
            		this.engel = '富裕';
            	} else if (engel < 40) {
            		this.engel = '相对富裕';
            	} else if (engel < 50) {
            		this.engel = '小康';
            	} else if (engel < 60) {
            		this.engel = '温饱';
            	} else {
            		this.engel = '贫穷'
            	}
			},
			'renderRadarText': function (option) {
				this.radarText.length = option.otherMsg.length;
				this.radarText.largeName = option.otherMsg.largeName;
				this.radarText.persent = option.otherMsg.persent;
			},
			'renderPieText': function (option) {
				this.pieData = option.otherMsg;
			},
			'render': function () {
				var self = this;
            	this.categoryRadar.option = compute.categoryRadar(self.bill);
            	this.fourPie.option = compute.fourPie(self.bill);
            	this.abar.option = compute.abar(self.bill);
            	this.renderEngel(this.abar.option);
            	this.renderRadarText(this.categoryRadar.option);
            	this.renderPieText(this.fourPie.option);
			}
		},
		mounted: function () {
			var self = this;
			window.ajax.simpost('/api/fetchBill', {
				startDate: '2017-01-01',
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

.analysis-body{
	background-color: #fff;
	padding: 0px 20px 20px 20px;
}

.analysis-row{
	border-bottom: 1px solid #eee;
}	

.analysis-text{
	display: inline-block;
	vertical-align: top;
	padding: 20px 0px;
	width: 400px;
}

.analysis-text > p{
	text-align: center;
	color: #666;
	font-size: 16px;
	line-height: 30px;
}

.analysis-text > p > span{
	color: #C23531;
	margin: 0px 10px;
	font-size: 20px;
}

.engel{
	box-sizing: border-box;
	padding: 20px;
	color: #fff;
	background-color: #C23531;
	width: 240px;
	height: 150px;
	margin: 0 auto;
}

.engel > h5{
	margin: 5px 0px;
	font-size: 14px;
}

.engel > p{
	font-style: italic;
	margin-top: 15px;
	margin-bottom: 0px;
	text-align: right;
	font-size: 45px;
}
</style>