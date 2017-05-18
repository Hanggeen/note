<template>
	<div>
		<div class="header-date">
      <img src="/images/niamoi2.png" class="logo">
      <span class="logotext">记录美好的每一天</span>
			<div class="header-date-content">
                <button v-on:click="logout" class="btn-logout"><span class="icon icon-switch"></span>退出</button>
                <router-link to="/userMessage"><button class="btn-logout"><span class="icon icon-user"></span>{{name}}</button></router-link>
            </div>
        </div>
        <div class="header">
           <div class="header-container">
            <div class="header-content">
                <div class="menu">
                    <router-link to="/record"><span class="icon icon-pencil"></span>记账</router-link>
                    <router-link to="/detail"><span class="icon icon-file-text2"></span>明细</router-link>
                    <router-link to="/graphics"><span class="icon icon-stats-bars2"></span>报表</router-link>
                    <router-link to="/analysis"><span class="icon icon-profile"></span>分析</router-link>
                  <router-link to="/configure"><span class="icon icon-equalizer"></span>配置</router-link>
                  <router-link to="/community"><span class="icon icon-book"></span>阅读</router-link>
              </div>
          </div>
      </div>
  </div>
</div>
</template>


<script type="text/javascript">
    var compute = require('../modules/compute.js');
    var eventHub = require('../components/eventHub.js');
    module.exports = {
        data: function () {
            return {
              name: null
            }
        },
        methods: {     
            /*退出当前账户*/
            logout: function () {
                swal({
                    text: '确定退出当前账户？',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '退出',
                    cancelButtonText: '取消'
                },function(isConfirm) {
                    if (isConfirm) {
                        window.ajax.simpost('/api/logout',function (error, result) {
                            if (result.errorCode == 0) {
                                window.location.href="./login.html"; 
                            }
                        })
                    }
                });
            },
            updateMessage: function () {            
                var self = this;
                window.ajax.simpost('/api/fetchUser',function (error, result) {
                    self.name = result.result.name;

                })
            }
        },
        /*创建时绑定事件*/
        created: function () {
            eventHub.$on('updateMessage', this.updateMessage);
        },
        /*最好在组件销毁前，清除事件监听*/
        beforeDestroy: function () {
            eventHub.$on('updateMessage', this.updateMessage);
        },
        mounted: function () {
            this.updateMessage();
        }
    };

</script>



<style scoped>


    .version-container{
      margin: 0 auto 10px auto ;
      padding: 5px 10px;
      width: 160px;
      color: #fff;
      border-bottom: 1px solid #666;
  }
  .version-container > p,.version-container > button{
      margin: 0px;
      padding: 0px;
      height: 30px;
  }

  .version-container > button{
      cursor: pointer;
      color: #bbb;
      background-color: rgba(0,0,0,0);
      border: 0px;
  }
  .version-container > button:hover{
      color: #fff;
  }


  .header-date{
    -webkit-transform: translateZ(0);
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    background-color: #353535;
    z-index: 999;
    border-bottom: 1px solid #ddd;
}

.header-date-content{
  padding-top: 15px;
  padding-right: 30px;
  float: right;
  min-width: 600px;
}


.header{
  -webkit-transform: translateZ(0);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  width: 200px;
  border-right: 1px solid #aaa;
  /*background-color: #eee;*/
  background-color: #353535;
  z-index: 99;
}

.header-container{
  padding-top: 50px;
  line-height: 50px;
}
.header-content{
  width: 200px;
}
.logo{
  margin: 8px 0px 0px 15px;
  height: 30px;
  width: 100px;
}

.logotext{
      color: #fff;
    position: relative;
    top: -9px;
    left: 9px;
}

.title{
  margin: 0px 10px 0px 10px;
  display: block;
  color: #fff;
  font-weight: 100;
  text-align: center;
  border-bottom: 1px solid #666;
}
.menu{
  display: inline-block;
  width: 100%;
}
.menu a{
  cursor: pointer;
  /*color: #333;*/
  color: #fff;
  display: block;
  padding-left: 40px;
}
.menu a:hover{
  background-color: #494949;
  /*background-color: #ccc;*/
  color: #fff;
}

.menu > .router-link-active{
  background-color: #444444;
  /*background-color: #ccc;*/
}
.icon{
  font-size: 15px;
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 15px;
  /*color: #666;*/
  color: #fff;
}


.btn-logout > .icon{
  margin-right: 5px;
  color: #eee;
}

.btn-logout{
  float: right;
  padding: 0px 15px;
  cursor: pointer;
  display: inline-block;
  /*width: 40px;*/
  color: #eee;
  background-color: rgba(0,0,0,0);
  border: 0px;
  text-align: center;
  vertical-align: middle;
}
.btn-logout:hover{
  color: #fff;
}



</style>