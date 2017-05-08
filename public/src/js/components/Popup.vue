<template>
	<transition  name="fade">
		<div v-if="show" class="pop-container" v-on:click="getClick" ref="out">
			<div class="pop-content">
				<echart :config="config"></echart>
			</div>
		</div>
	</transition>
</template>

<script type="text/javascript">
	var Echart = require('../components/Echart');
	var eventHub = require('./eventHub');
	module.exports = {
		data: function(){
			return {
				config: null,
				show: false
			}
		},
		components: {
			'echart': Echart
		},
		/*创建时绑定事件*/
		created: function () {
  			eventHub.$on('showPopup', this.showPopup);
  			eventHub.$on('hidePopup', this.hidePopup);
		},
		/*最好在组件销毁前，清除事件监听*/
		beforeDestroy: function () {
 	 		eventHub.$off('showPopup', this.showPopup);
  			eventHub.$off('hidePopup', this.hidePopup);
		},
		methods: {
			/*若点击的是out笼罩层，则关闭弹出层*/
			'getClick': function(e){
				if (e.target == this.$refs.out) {
					this.show = false;
				}
			},
			/*传入参数，显示笼罩层*/
			'showPopup': function (config) {
				this.config = config;
				this.show = true;
			},
			/*关闭笼罩层*/
			'hidePopup': function () {
				this.show = false;
			}
		}
	};

</script>
<style scoped>

.pop-container{
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
}
.pop-content{
  position: absolute;
  height: 480px;
  width: 900px;
  top: 50%;
  left: 50%;
  margin-left: -470px;
  margin-top: -250px;
  background-color: #fff;
  border-radius: 20px;
  /*padding: 20px 0px;*/
  overflow: hidden;
}
.pop-menu{
  height: 40px;
  padding: 0px 20px;
  margin-bottom: -10px;
  text-align: right;
  line-height: 40px;
  border-bottom: 1px solid #eee;
}
.pop-menu > button{
  color: #ccc;
  background-color: rgba(0,0,0,0);
  border: 0px;
}

.pop-menu > button:hover{
  color: #aaa;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity, .3s;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
</style>