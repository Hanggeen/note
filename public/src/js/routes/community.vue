<template>
	<div class="content">
		<div class="content-title" v-show="showList">
			<p>社区 | Community<a v-on:click="back" class="com-back" v-show="!showList">返回上一级</a></p>
		</div>
		<div class="com-body">
			<div class="com-row" v-show="showList">
				<div v-for="item in list" class="com-text">
					<img :src="item.image"  v-on:click="showText('/html/' + item.file)">
					<h2  v-on:click="showText('/html/' + item.file)">{{item.title}}<span>发表时间：{{item.time}}</span></h2>
					<p  v-on:click="showText('/html/' + item.file)">{{item.intro}}</p>
				</div>
			</div>
			<div class="com-row" v-if="!showList" style="padding-top:30px;">
				<iframe id="iframe" :src="htmlurl" style="visibility:hidden" v-on:load="setHeight"></iframe>
			</div>
		</div>
		<div class="toolbox" v-show="!showList">
			<button v-on:click="back">返回</button>
			<br/>
			<button v-on:click="totop">顶部</button>
		</div>
	</div>
</template>

<script type="text/javascript">
	module.exports = {
		data: function(){
			return {
				showList: true,
				list: {},
				htmlurl: ''
			}
		},
		methods: {
			'showText': function (url) {
				this.htmlurl = url;
				this.showList = false;
			},
			'back': function () {
				this.showList = true;
			},
			'setHeight': function () {
					var iframe = document.getElementById('iframe');

				    var height = iframe.contentDocument.body.offsetHeight;
				    var style = 'width:100%;height:'+(height+100)+'px';
				    iframe.setAttribute('style',style);
					// if(iframe.Document){//ie自有属性
				 //        iframe.style.height = iframe.Document.documentElement.scrollHeight;
				 //    }else if(iframe.contentDocument){//ie,firefox,chrome,opera,safari
				 //        // iframe.setAttrbute = iframe.contentDocument.body.offsetHeight ;
				 //        // iframe.style.height = iframe.contentDocument.body.offsetHeight ;
				 //    }
			},
			'totop': function () {
				if (document.body.scrollTop) {
					document.body.scrollTop = 0;
				} else {
					document.documentElement.scrollTop = 0;
				}
			}
		},
		mounted: function () {
			var self = this;
			window.ajax.simget('/html/list.json', function (error, result) {
				if (error == null) {
					var o = result;
					self.list = o.value;
				} else {
					swal("加载失败","请检查您的网络","error");
				}
			})
		}
	};

</script>

<style type="text/css">

.com-back{
	cursor: pointer;
	float: right;
	font-size: 14px;
	position: relative;
	top: 2px;
}

.com-body{
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
}

.com-row{
	margin: 20px 0px;
	padding-left: 30px;
	padding-bottom: 30px;
	color: #666;
}
.com-row > p {
	font-size: 16px;
}
.com-row > p > span{
	margin: 0px 5px;
	font-size: 22px;
	color : #C23531;
}

.com-body iframe{
	border: 0px;
}

.com-text{
	max-width: 800px;
	height: 80px;
	border-bottom: 1px solid #ddd;
	padding: 30px 0px;
}

.com-text > img{
	cursor: pointer;
	float: left;
	margin-right: 20px;
	width: 80px;
	height: 80px;
}

.com-text > h2{
	cursor: pointer;
	margin-top: 5px;
	margin-bottom: 5px;
}
.com-text > h2 > span{
	float: right;
	font-size: 14px;
	font-weight: 100;
}
.com-text > p{
	cursor: pointer;
	line-height: 20px;
}

.toolbox{
	position: fixed;
	right: 10px;
	top:100px;
}

.toolbox > button{
	cursor: pointer;
	margin: 1px;
	width: 50px;
	height: 50px;
	background-color: #fff;
	border: 1px solid #ccc;
}
.toolbox > button:hover{
	background-color: #eee;
}

</style>