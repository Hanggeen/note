<template>
	<div class="content">
		<div class="content-title">
			<p>记账 | Record</p>
		</div>
		<div v-if="loading" class="content-loading">
			<p style="text-align:center">加载中</p>
		</div>
		<div v-else class="content-body">
			<div class="record-square custom">
				<div class="title">
					<p>自定义</p>
					<div class="horn"></div>
				</div>
				<div class="form">
					<div class="form-row" style="border-bottom: 1px solid #ddd">
						<div class="form-cube">
							<label>日期</label>
							<div ref="customDate" class="date">{{custom.date}}</div>
						</div>
						<div class="form-cube gap">
							<label>备注</label>
							<input v-model="custom.note" class="text-input" style="width:300px" placeholder="买了什么/吃了什么/用在什么地方...">
						</div>
						<div class="form-cube gap">
							<label>金额</label>
							<input v-model="custom.price" class="text-input" style="width:50px" placeholder="">
						</div>
					</div>
					<div class="form-row" style="font-size:12px;color: #666">
						<span class="margin-right30px">选填： </span>
						<div class="form-cube">
							<label>种类</label>
							<select v-model="custom.category">
								<option value="null">不填</option>
								<option v-for="(item, index) in config.category">{{index}}</option>
							</select>
						</div>
						<div class="form-cube gap">
							<label>类型</label>
							<select v-model="custom.sort" style="width:100px">
								<option value="null">不填</option>
								<option v-for="item in config.category[custom.category]">{{item}}</option>
							</select>
						</div>
						<div class="form-cube gap">
							<label>支付方式</label>
							<select v-model="custom.payway">
								<option value="null">不填</option>
								<option v-for="item in config.payway">{{item}}</option>
							</select>
						</div>
						<div class="form-cube gap">
							<label>项目</label>
							<select v-model="custom.project">
								<option value="null">不填</option>
								<option v-for="item in config.project">{{item}}</option>
							</select>
						</div>
						<div class="form-cube gap">
							<label>角色</label>
							<select v-model="custom.role">
								<option value="null">不填</option>
								<option v-for="item in config.role">{{item}}</option>
							</select>
						</div>
					</div>
					<div>
						<button class="custom-save" v-on:click="saveCustom">保存</button>
					</div>
				</div>
			</div>
			<div style="visibility: hidden" class="record-square quick">
				<div class="title">
					<p>预定义</p>
					<div class="horn"></div>
				</div>
				<div class="form">
					<div class="form-row" style="border-bottom: 1px solid #ddd">
						<div class="form-cube">
							<div class="quick-title">饮食</div>
						</div>
						<div class="form-cube">
							<label>种类</label>
							<select>
								<option>全部</option>
								<option>交通</option>
								<option>饮食</option>
								<option>服饰</option>
								<option>游玩</option>
							</select>
						</div>
						<div class="form-cube gap">
							<label>备注</label>
							<input class="text-input" style="width:200px" placeholder="吃了什么/喝了什么...">
						</div>
						<div class="form-cube gap">
							<label>金额</label>
							<input class="text-input" style="width:50px" placeholder="">
						</div>
						<div class="form-cube gap">
							<button class="quick-save">保存</button>
						</div>
					</div>
					<div class="form-row" style="border-bottom: 1px solid #ddd">
						<div class="form-cube">
							<div class="quick-title">出行</div>
						</div>
						<div class="form-cube">
							<label>种类</label>
							<select>
								<option>全部</option>
								<option>交通</option>
								<option>饮食</option>
								<option>服饰</option>
								<option>游玩</option>
							</select>
						</div>
						<div class="form-cube gap">
							<label>备注</label>
							<input class="text-input" style="width:200px" placeholder="上班/下班/去哪儿...">
						</div>
						<div class="form-cube gap">
							<label>金额</label>
							<input class="text-input" style="width:50px" placeholder="">
						</div>
						<div class="form-cube gap">
							<button class="quick-save">保存</button>
						</div>
					</div>
					<div class="form-row" style="border-bottom: 1px solid #ddd">
						<div class="form-cube">
							<div class="quick-title">服饰</div>
						</div>
						<div class="form-cube">
							<label>类型</label>
							<select>
								<option>全部</option>
								<option>交通</option>
								<option>饮食</option>
								<option>服饰</option>
								<option>游玩</option>
							</select>
						</div>
						<div class="form-cube gap">
							<label>备注</label>
							<input class="text-input" style="width:200px" placeholder="买了什么/运动/休闲...">
						</div>
						<div class="form-cube gap">
							<label>金额</label>
							<input class="text-input" style="width:50px" placeholder="">
						</div>
						<div class="form-cube gap">
							<button class="quick-save">保存</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

	var calender = require('../modules/calender.js');

	module.exports = {
		data: function(){
			return {
				loading: true,
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
				config: null,
				selectedCategory: null
			}
		},
		components: {
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
			'saveCustom': function () {
				console.log(this.custom);
				var self = this;
				window.ajax.simpost('/api/record', self.custom, function (error, result) {
					if (result.errorCode == 0) {
						swal("保存成功","一条记录已插入","success");
						self.custom.date = self.getTodayDate();
						self.custom.note = null;
						self.custom.price = null;
						self.custom.category = null;
						self.custom.sort = null;
						self.custom.payway = null;
						self.custom.project = null;
						self.custom.role = null;
						console.log(result);
					} else {
						swal("保存失败",result.errorCode,"error");
					}
				})
			},
			'deploy': function () {
				var self = this;
				self.$nextTick(function () {
					/*开始日期日历插件初始化*/
					calender(self.$refs.customDate).init({
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
			}
		},
		mounted: function () {
			var self = this;
			window.ajax.simpost('/api/fetchConfig',function (error, result) {
				if (result.errorCode == 0) {
					console.log(result);
					self.config = result.result;
					self.loading = false;
					self.deploy();
				} else {
					swal("加载失败","请检查您的网络","error");
				}
			})

		}
	};

</script>


<style type="text/css">

.record-square{
	position: relative;
	margin-bottom: 20px;
	width: 100%;
	background-color: #fff;
}
.record-square > .title {
	position: absolute;
}
.record-square > .title > .horn{
	width: 0;
    height: 0;
    border-right: 100px solid transparent;
}
.record-square > .title > p{
	margin: 25px 0px 0px 7px;
	float: left;
	color: #fff;
	font-size: 18px;
	font-weight: 900;
	transform:rotate(-45deg);
}



.custom > .title > .horn{
    border-top: 100px solid #8DB6CD;
}
.quick > .title > .horn{
    border-top: 100px solid #EEA2AD;
}

.form {
	padding: 20px 0px 30px 80px;
}

.form-row{
	margin-right: 20px;
	padding: 20px 0px;
}

.quick .form-row{
	padding: 40px 0px;
}

.quick-title{
	margin-right: 20px;
	width: 60px;
	height: 60px;
	text-align: center;
	line-height: 60px;
	color:#fff;
	background-color: #EEA2AD;
	border-radius: 50%;
}


.gap{
	margin-left: 20px;
}

.form-cube{
	display: inline-block;
}


.form-cube > select {
	height: 36px;
    border-radius: 5px;
    border-color: #ddd;
    padding: 0px 3px;
}

.text-input{
	height: 36px;
	border: 1px solid #ddd	;
    border-radius: 5px;
    padding: 0px 10px;
}

.custom-save, .quick-save{
	cursor: pointer;
	font-family: "arial","STHeiti","Microsoft YaHei";
	width: 130px;
	height: 40px;
	color: #fff;
	text-align: center;
	background-color: #8DB6CD;
	border: 0px;
	border-radius: 5px;
}

.custom-save{
	width: 130px;
	height: 40px;
	font-size: 16px;
	line-height: 40px;
}
.quick-save{
	width: 70px;
	height: 36px;
	font-size: 14px;
	line-height: 36px;
	background-color: #EEA2AD;
}
.custom-save:hover{
	background-color: #579BC1;
}

.quick-save:hover{
	background-color: #F37C8E;
}



</style>