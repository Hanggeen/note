<template>
	<div class="sub-nav">
		<router-link v-bind:class="{'active': id == item.name}" v-for="item in config" :to="item.route">{{item.title}}</router-link>
	</div>
</template>

<script type="text/javascript">
	module.exports = {
		props: ['config'],
		data: function(){
			return {
				id: null
			}
		},
		watch: {
			'$route.params.id': function(newValue, oldValue){
				if (newValue != undefined) {
					this.id = newValue;
				}
			}
		},
		created: function () {
			/*若此时路由没有选中选项卡，则默认高亮显示第一个*/
			if (this.$route.params.id == undefined) {
				this.id = this.config[0].name;
			} else {
				this.id = this.$route.params.id;
			}
		}
	};

</script>


<style>
.sub-nav{
    -webkit-transform: translateZ(0);
  position: fixed;
  top: 71px;
  left: 201px;
  width: 100%;
  height: 60px;
  padding-left: 20px; 
  background: #fff;
  border-bottom: 1px solid #ccc;
  z-index: 99;
}

.sub-nav > a{
  color: #333;
  cursor: pointer;
  margin: 24px 5px 0px 5px;
  display: inline-block;
  height: 35px;
  padding: 0px 15px;
  background-color: #fff;
  line-height: 35px;
  border-radius: 10px 10px 0px 0px;
  border: 1px solid #ccc;
}

.sub-nav > a:hover{
  color: #333;
}


.sub-nav > .active{
  border-bottom: 1px solid #fff;
  background-color: #fff;
}

</style>