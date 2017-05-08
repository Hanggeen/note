<template>
	<div class="content">
		<div class="content-title">
			<p>用户资料 | User message</p>
		</div>
		<div class="message-body">
			<div class="message-cube">
				<label>我的昵称</label>
				<input v-model="message.name" :disabled="disabled" v-bind:class="{disabled:disabled}">
			</div>
			<div class="message-cube">
				<label>我的邮箱</label>
				<input v-model="message.account" :disabled="true" class="disabled">
			</div>
			<div class="message-cube">
				<label>我的密码</label>
				<a class="password-modify">修改</a>
			</div>
			<div class="message-cube">
				<label>我的电话</label>
				<input v-model="message.phone" :disabled="disabled" v-bind:class="{disabled:disabled}">
			</div>
			<div class="message-cube">
				<label>注册时间</label>
				<input v-model="message.date" :disabled="true" class="disabled">
			</div>
			<div class="message-button">
				<button v-show="disabled" v-on:click="modify">修改资料</button>
				<button v-show="!disabled" v-on:click="save">保存</button>
				<button v-show="!disabled" v-on:click="restore">还原</button>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
    var eventHub = require('../components/eventHub.js');
	module.exports = {
		data: function(){
			return {
				disabled: true,
				message: {
				}
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
			modify: function () {
				this.disabled = false;
			},
			restore: function () {
				this.disabled = true;
				var self = this;
				window.ajax.simpost('/api/fetchUser',function (error, result) {
					self.message = result.result;
					self.message.date = self.format(self.message.timestamp);
				})
			},
			save: function () {
				this.disabled = true;
				var self = this;
				var data = {
					name: self.message.name,
					phone: self.message.phone
				}

				window.ajax.simpost('/api/updateUserMessage',data, function (error, result) {
					if (result.errorCode == 0) {
						swal("保存成功","","success");
						eventHub.$emit('updateMessage');
					} else {
						swal("保存失败",result.errorCode,"error");
					}
				})
			}
		},
		mounted: function () {
			var self = this;
			window.ajax.simpost('/api/fetchUser',function (error, result) {
				self.message = result.result;
				self.message.date = self.format(self.message.timestamp);
			})
		}
	};

</script>

<style type="text/css">
.message-body{
	box-sizing: border-box;
	padding: 50px 20px 20px 20px;
	width: 100%;
	height: 500px;
	background-color: #fff;
}

.message-body .disabled{
	border: 1px solid #fff;
	background-color: #fff;
}

.message-cube > label{
	margin-right: 15px;
	font-size: 16px;
	height: 60px;
	display: inline-block;
	width: 200px;
	text-align: right;
}

.message-cube > input{
	font-size: 16px;
	padding: 5px 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
}
.message-button{
	padding-left: 160px;
}

.message-button > button{
	cursor: pointer;
	margin-right: 10px;
	height: 30px;
	padding: 0px 20px;
	color: #fff;
	background-color: #8DB6CD;
	border-radius: 5px;
	border: 0px;
}

.password-modify{
	margin-left: 11px;
	cursor: pointer;
	font-size: 15px;
}

</style>