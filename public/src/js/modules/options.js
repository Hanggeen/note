var color = ['#c23531','#2f4554','#61a0a8','#d48265','#749f83','#ca8622','#6e7074','#7c2186','#6e7074','#217513'];

module.exports = {
	process: {
		grid: {
			left: 10,
			right: 10,
			top: 5,
			bottom: 5
		},
		xAxis: {
			show: false,
			type: 'value',
			max: 0,
			position: [0,200]
		},
		yAxis: {
			show: false,
			type: 'category',
			data: []
		},
		series: [
		{
			type: 'bar',
			data: []
		}
		],
		backgroundColor: '#61a0a8'

	},
	line: {
		color: color,
		tooltip: {
			trigger: 'axis',
			position: function(pos, params, dom, rect, size){
				if (pos[0] > 750) {
					if (document.body.offsetWidth < 1350)
						return [pos[0]-size.contentSize[0]-40,'10%'];
					else 
						return [pos[0]+40,'10%'];
				} else {
					return [pos[0]+40,'10%'];
				}
			}
		},
		legend: {
			bottom: 20,
			data: []
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		grid: {
			x: 60,
			y: 20,
			x2: 40,
			y2: 80
		},
		toolbox: {
			bottom: 16,
			right: 40,
			feature: {
				magicType: {
					show: true,
					type: ['line','bar']
				}
			}
		},
		yAxis: {
			type: 'value'
		},
		series: []
	},
	groupLine: {
		color: color,
		tooltip: {
			trigger: 'axis',
			position: function(pos, params, dom, rect, size){
				if (pos[0] > 750) {
					if (document.body.offsetWidth < 1350)
						return [pos[0]-size.contentSize[0]-40,'10%'];
					else 
						return [pos[0]+40,'10%'];
				} else {
					return [pos[0]+40,'10%'];
				}
			}
		},
		legend: {
			bottom: 20,
			data: []
		},
		grid: {
			x: 60,
			y: 20,
			x2: 40,
			y2: 80
		},
		toolbox: {
			bottom: 16,
			right: 40,
			feature: {
				magicType: {
					show: true,
					type: ['stack','tiled'],
					option: {
						stack: {
							areaStyle: {
								normal: {
									opacity: 0.7
								}
							}
						},
						tiled: {
							areaStyle: {
								normal: {
									opacity: 0
								}
							}
						}
					}
				}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		yAxis: {
			type: 'value'
		},
		series: []
	},
	pie: {
		color: color,
		tooltip : {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			top: 0,
			left: 15,
			data: ['Android','iOS','PC','TV','Web'],
		},
		series : [
		{
			type: 'pie',
			radius : ['50%','70%'],
			center: [380, '45%'],
			label: {
				normal: {
					position: 'outside',
					formatter: "{b} : {c}"
				}
			},
			data: []
		}
		]
	},
	groupPie: {
		color: color,
		tooltip : {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			top: 50,
			left: 600,
			data: [],
		},
		series : [
		{
			type: 'pie',
			radius: [0, '30%'],
			center: [300, '50%'],
			label: {
				normal: {
					position: 'outside',
					formatter: function(params){
						if(params.percent > 5){
							return params.name + "：" +  params.value;
						} else {
							return params.name + "：" +  params.value + " (" + params.percent + "%)";
						}
					}
				}
			},
			data: []
		}
		]
	},
	radar: {
		tooltip: {},
	    legend: {
			bottom: 20,
	        data: ['消费分布图']
	    },
	    radar: {
	        // shape: 'circle',
	        indicator: [],
			radius : '50%',
			center: ['50%', '40%'],
	    },
	    series: [{
	        type: 'radar',
	        areaStyle: {normal: {opacity:0.3}},
	        data : [
	            {
	                value : [],
	                name : '消费分布图'
	            }
	        ]
	    }]
	},
	fourPie: {
		color: ['#C23531','#ddd'],
		tooltip: {
			trigger: 'item',
			formatter: "{b}: {c} ({d}%)"
		},
		series: [
			{
				type:'pie',
				radius: ['25%', '35%'],
				center: ['45%', '25%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false,
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:[
					{value:335, name:'服饰'},
					{value:310, name:'其他'}
				]
			},
			{
				type:'pie',
				tooltip: {
					show: false
				},
				radius: ['0%', '0%'],
				center: ['45%', '25%'],
				label: {
					normal: {
						show: true,
						position: 'center',
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				data:[
					{value:0, name:'服饰'}
				]
			},
			{
				type:'pie',
				center: ['80%', '25%'],
				radius: ['25%','35%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false,
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:[
					{value:335, name:'饮食'},
					{value:310, name:'其他'}
				]
			},
			{
				type:'pie',
				tooltip: {
					show: false
				},
				radius: ['0%', '0%'],
				center: ['80%', '25%'],
				label: {
					normal: {
						show: true,
						position: 'center',
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				data:[
				{value:0, name:'饮食'}
				]
			},
			{
				type:'pie',
				center: ['30%', '75%'],
				radius: ['25%','35%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false,
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:[
				{value:335, name:'住宿'},
				{value:310, name:'其他'}
				]
			},
			{
				type:'pie',
				tooltip: {
					show: false
				},
				radius: ['0%', '0%'],
				center: ['30%', '75%'],
				label: {
					normal: {
						show: true,
						position: 'center',
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				data:[
				{value:0, name:'住宿'}
				]
			},
			{
				type:'pie',
				center: ['65%', '75%'],
				radius: ['25%','35%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false,
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:[
				{value:335, name:'交通'},
				{value:310, name:'其他'}
				]
			},
			{
				type:'pie',
				tooltip: {
					show: false
				},
				radius: ['0%', '0%'],
				center: ['65%', '75%'],
				label: {
					normal: {
						show: true,
						position: 'center',
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				},
				data:[
				{value:0, name:'交通'}
				]
			}
		]
	},
	abar: {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
			bottom: 20,
	        data:['恩格尔系数']
	    },
		grid: {
			x: 60,
			y: 20,
			x2: 40,
			y2: 80
		},
	    xAxis : [
	        {
	        	max: 100,
	            type : 'value'
	        }
	    ],
	    yAxis : [
	        {
	            type : 'category',
	            axisTick : {show: false},
	            data : ['']
	        }
	    ],
	    series : [
	        {
	            name:'恩格尔系数',
	            type:'bar',
	            barWidth: 60,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'inside',
	                    formatter: '{c}%'
	                }
	            },
	            data:[24]
	        }
	    ]
	},
	groupBar: {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
			bottom: 20,
	        data: ['直接访问', '邮件营销','联盟广告','视频广告','搜索引擎']
	    },
		grid: {
			x: 80,
			y: 20,
			x2: 80,
			y2: 120
		},
		dataZoom: [
			{
				type: 'slider',
				bottom: 55
			}
		],
	    xAxis:  {
	        type: 'category',
	        data: ['周一','周二','周三','周四','周五','周六','周日']
	    },
	    yAxis: {
	        type: 'value'
	    },
		toolbox: {
			bottom: 16,
			right: 40,
			feature: {
				restore: {
					show: true
				},
				magicType: {
					show: true,
					type: ['tiled']
				}
			}
		},
	    series: [
	        {
	            name: '直接访问',
	            type: 'bar',
	            stack: '总量',
	            data: [320, 302, 301, 334, 390, 330, 320]
	        },
	        {
	            name: '邮件营销',
	            type: 'bar',
	            stack: '总量',
	            data: [120, 132, 101, 134, 90, 230, 210]
	        },
	        {
	            name: '联盟广告',
	            type: 'bar',
	            stack: '总量',
	            data: [220, 182, 191, 234, 290, 330, 310]
	        },
	        {
	            name: '视频广告',
	            type: 'bar',
	            stack: '总量',
	            data: [150, 212, 201, 154, 190, 330, 410]
	        },
	        {
	            name: '搜索引擎',
	            type: 'bar',
	            stack: '总量',
	            data: [820, 832, 901, 934, 1290, 1330, 1320]
	        }
	    ]
	}
}