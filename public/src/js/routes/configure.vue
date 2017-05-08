<template>
	<div class="content">
		<div class="content-title">
			<p>配置 | Configure</p>
		</div>
		<div class="configure-save">
			<button v-on:click="save" class="save">保存</button>
			<button v-on:click="cancel" class="cancel">还原</button>
		</div>
		<div class="configure">
			<div class="configure-frame">
				<div class="configure-insert" style="margin-bottom:20px;">
					<span>种类</span>
					<input ref="category" placeholder="添加新种类">
					<button v-on:click="addCategory()">添加</button>
				</div>
				<div v-for="(item, index) in config.category" class="configure-category">
					<div class="configure-category-insert">
						<span>{{item.name}}<span v-on:click="deleteCategory(index)" class="icon-cross"></span></span>
						<span class="configure-category-list" v-for="(sort, index2) in item.value">{{sort}}
						<span v-on:click="deleteSort(item.name, index2)" class="icon-cross"></span></span>
						<input :ref="item.name" style="width: 115px" placeholder="添加新类型...">
						<button v-on:click="addSort(item.name)">添加</button>
					</div>
					<div >
					</div>
				</div>
			</div>
			<div class="configure-frame">
				<div class="configure-insert">
					<span>支付方式</span>
					<input ref="payway" placeholder="输入新支付方式">
					<button v-on:click="add('payway')">添加</button>
				</div>
				<div class="configure-list">
					<span v-for="(item,index) in config.payway">{{item}}<span v-on:click="deleteLabel('payway',index)" class="icon-cross"></span></span>
				</div>
			</div>
			<div class="configure-frame">
				<div class="configure-insert">
					<span>项目</span>
					<input ref="project" placeholder="输入新项目">
					<button v-on:click="add('project')">添加</button>
				</div>
				<div class="configure-list">
					<span v-for="(item,index) in config.project">{{item}}<span v-on:click="deleteLabel('project',index)" class="icon-cross"></span></span>
				</div>
			</div>
			<div class="configure-frame">
				<div class="configure-insert">
					<span>角色</span>
					<input ref="role" placeholder="输入新角色">
					<button v-on:click="add('role')">添加</button>
				</div>
				<div class="configure-list">
					<span v-for="(item,index) in config.role">{{item}}<span v-on:click="deleteLabel('role',index)" class="icon-cross"></span></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	module.exports = {
		data: function(){
			return {
				config: {
					category: [],
					payway: [],
					project: [],
					role: []
				}
			}
		},
		components: {
		},
		watch: {
		},
		methods: {
			'add': function (kind) {
				var val = this.$refs[kind].value;
				this.config[kind].push(val);
				this.$refs[kind].value = null;
			},
			'addCategory': function () {
				var val = this.$refs.category.value;
				this.config.category.push({
					"name": val,
					"value": []
				});
				this.$refs.category.value = null
			},
			'addSort': function (name) {
				var self = this;
				var val = this.$refs[name][0].value;
				this.config.category.forEach(function(item, index, array){
					if (item.name == name) {
						item.value.push(val);
						self.$refs[name][0].value = null
					}
				})
				console.log(this.$refs[name][0].value)
			},
			'deleteLabel': function (kind, index) {
				this.config[kind].splice(index,1);
			},
			'deleteCategory': function (index) {
				this.config.category.splice(index,1);
			},
			'deleteSort': function (name, index) {

				this.config.category.forEach(function(item, index2, array){
					if (item.name == name) {
						item.value.splice(index,1);
					}
				})
			},
			'save': function () {
				var self = this;

				var category = {};

				this.config.category.forEach(function (item, index, array) {
					category[item.name] = item.value;
				});

				var data = {
					"category": category,
					"payway": self.config.payway,
					"project": self.config.project,
					"role": self.config.role
				}

				console.log(JSON.stringify(data));


				window.ajax.simpost('/api/updateConfig',{
					config: JSON.stringify(data)
				}, function (error, result) {
					if (result.errorCode == 0) {
						swal("保存成功","配置已更新","success");
					} else {
						swal("加载失败","请检查您的网络","error");
					}
				})




			},
			'cancel': function () {
				var self = this;
				window.ajax.simpost('/api/fetchConfig',function (error, result) {
					if (result.errorCode == 0) {
						var category = [];

						for (var key in result.result.category) {
							category.push({
								"name": key,
								"value": result.result.category[key]
							})
						} 

						self.config = result.result;
						self.config.category = category;
						console.log(self.config);
					} else {
						swal("加载失败","请检查您的网络","error");
					}
				})
			}
		},
		mounted: function () {
			var self = this;

			window.ajax.simpost('/api/fetchConfig',function (error, result) {
				if (result.errorCode == 0) {
					var category = [];

					for (var key in result.result.category) {
						category.push({
							"name": key,
							"value": result.result.category[key]
						})
					} 

					self.config = result.result;
					self.config.category = category;
					console.log(self.config);
				} else {
					swal("加载失败","请检查您的网络","error");
				}
			})

			// setTimeout(function(){console.log(self.)},4000)


		}
	};

</script>

<style type="text/css">

.configure-frame{
	box-sizing: border-box;
	margin-bottom: 20px;
	padding: 20px 30px;
	width: 100%;
	background-color: #fff;
}





.configure-save{
	box-sizing: border-box;
	margin-bottom: 20px;
	padding: 20px 30px;
	width: 100%;
	background-color: #fff;
}
.configure-save > button{
	cursor: pointer;
	margin-right: 10px;
	height: 30px;
	padding: 0px 20px;
	color: #fff;
	background-color: #8DB6CD;
	border-radius: 5px;
	border: 0px;
}

.configure-save > .save{
	background-color: #8DB6CD
}

.configure-save > .cancel{
	background-color: #EC6C7E
}





.configure-category{
	padding-top: 30px;
	border-top: 1px solid #ddd;
}

.configure-category-insert{
	height: 60px;
}

.configure-category-insert > span{
	padding: 10px;
	margin-right: 10px;
	color: #fff;
	border-radius: 5px;
	background-color: #EC6C7E;
}

.configure-category-insert > input{
	margin-right: 10px;
	padding: 0px 10px;
	height: 25px;
	border-radius: 5px;
	border: 1px solid #ccc;
}

.configure-category-insert > button{
	height: 27px;
	color: #fff;
	background-color: #8DB6CD;
	border-radius: 5px;
	border: 0px;
}
.configure-category-insert .icon-cross{
	cursor: pointer;
	color: rgba(255,255,255,0.6);
	margin-left: 5px;
	font-size: 10px;
}

.configure-category-insert .icon-cross:hover{
	color: #fff;
}



.configure-category-insert >.configure-category-list{
	margin-right: 10px;
	display: inline-block;
	padding: 8px 10px;
	color: #fff;
	border-radius: 5px;
	background-color: #EEA2AD;
}

.configure-category-list .icon-cross{
	cursor: pointer;
	color: rgba(255,255,255,0.6);
	margin-left: 5px;
	font-size: 10px;
}

.configure-category-list .icon-cross:hover{
	color: #fff;
}












.configure-insert > span{
	margin-right: 20px;
	font-size: 17px;
	font-weight: 500;
}

.configure-insert > input{
	margin-right: 10px;
	padding: 0px 10px;
	height: 25px;
	border-radius: 5px;
	border: 1px solid #ccc;
}

.configure-insert > button{
	height: 27px;
	color: #fff;
	background-color: #8DB6CD;
	border-radius: 5px;
	border: 0px;
}

.configure-list{
	margin: 20px 0px 15px 0px;
}

.configure-list > span{
	margin-right: 10px;
	display: inline-block;
	padding: 8px 10px;
	color: #fff;
	border-radius: 5px;
	background-color: #EEA2AD;
}

.configure-list .icon-cross{
	cursor: pointer;
	color: rgba(255,255,255,0.6);
	margin-left: 5px;
	font-size: 10px;
}

.configure-list .icon-cross:hover{
	color: #fff;
}



</style>