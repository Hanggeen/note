<template>
	<div class="c-container">
        <div class="c-header" v-if="config.title != ''">
          <title>{{config.title}}</title>
        </div>
        <div class="c-body">
       <div class="chart" ref="chart"></div>
   </div>
</div>
</template>


<script type="text/javascript">

	module.exports = {
		props: ['config'],
		data:function () {
    			return {
            chart: null
          }
        },
        watch: {
            'config.option': function () {
              this.render();
            }
        },
        methods: {
            'showLoading': function () {
                var chart = this.chart;
                chart.clear();
                chart.showLoading();
            },
            'hideLoading': function () {
                var chart = this.chart;
                chart.hideLoading();
            },
            'noDataOption': function () {
                var chart = this.chart;
                chart.clear();
                chart.showLoading({
                    text: '暂无数据',
                    color: 'rgba(255, 255, 255, 0)',
                    textColor: '#000',
                    maskColor: '#fff',
                    zlevel: 0
                });
            },
            'render': function () {
                if (this.config.option == 'showLoading') {
                    this.showLoading();
                } else if (this.config.option == 'noDataOption') {
                    this.hideLoading();
                    this.noDataOption();
                } else {
                    this.hideLoading();
                    this.chart.setOption(this.config.option);
                }
            }
        },
		mounted: function () {
            var self = this;
            self.$refs.chart.style.width = self.config.width + 'px';
            self.$refs.chart.style.height = self.config.height + 'px';

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(self.$refs.chart);
            self.chart = myChart;

            self.render();

        }
    };

</script>


<style scoped>


    .c-header .tips{
      font-size:  12px;
      background-color: #c23531;
      color: #fff;
      padding: 5px;
      border-radius: 5px;
      position: relative;
      top: -4px;
      left: 10px;
  }

  .c-container{
      display: inline-block;
      margin: 10px 20px 10px 0px;
      /*box-shadow:5px 5px 20px #666;*/
      background-color: #fff;
      text-align: left;
  }
  .chart{
      background-color: #fff;
  }

  .c-header{
      width: 100%;
      height: 49px;
      /*border-bottom: 1px solid #ddd;*/
  }
  .c-body{

  }
  title{
      display: inline;
      margin: 10px 20px 0px 20px;
      height: 25px;
      line-height: 50px;
      font-size: 15px;
      color: #333;
  }



</style>