
//仪表盘
function echar_init_yibiaopan(id,charName,charValue) {

	var dom = document.getElementById(id);
	var myChart = echarts.init(dom);
	var app = {};
	option = {
		tooltip : {
			formatter : "{a} <br/>{b} : {c}%"
		},
		toolbox : {
			feature : {
				restore : {},
				saveAsImage : {}
			}
		},
		series : [ {
			name : '业务指标',
			type : 'gauge',
			detail : {
				formatter : '{value}%'
			},
			data : [ {
				value : charValue,
				name : charName
			} ]
		} ]
	};
	
	myChart.setOption(option, true);
	
}


//====================
function kline(jsonData,id){

	rawData = kkformatData(jsonData);
	
	var dom = document.getElementById(id);
	var myChart = echarts.init(dom);
	
	var app = {};

	
	var chan = _CHAN;
	var point = _SURE;
	
	function calculateMA(dayCount, data) {
		var result = [];
		for (var i = 0, len = data.length; i < len; i++) {
			if (i < dayCount) {
				result.push('-');
				continue;
			}
			var sum = 0;
			for (var j = 0; j < dayCount; j++) {
				sum += data[i - j][1];
			}
			result.push(sum / dayCount);
		}
		return result;
	}
	
	var dates = rawData.map(function(item) {
		return item[0];
	});
	
	var data = rawData.map(function(item) {//O,C,L,H
		return [ +item[1], +item[2], +item[3], +item[4] ];
	});
	
	var _cd = layui.data('layuitable')._cd;
	if(parseInt(_cd)<61){
		_cd = _cd+"分";
	}else if(_cd == 240){
		_cd = "日线";
	}else{
		;
	}	
	var option = {
		backgroundColor : '#21202D',
		legend : {
			data : [ _cd, '短期线', '中期线', '年线' ],
			inactiveColor : '#777',
			textStyle : {
				color : '#fff'
			}
		},
		
		 toolbox: {
		        show : true,
		        feature : {
		            mark : {show: true},
		            dataZoom : {show: true},
		            dataView : {show: true, readOnly: false},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    
		    
		    
		tooltip : {
			trigger : 'axis',
			formatter: function (params) {
					
				  var res = params[0].seriesName + ' ' + params[0].name;
		            res += '<br/>  开盘 : ' + params[0].value[1] + '  最高 : ' + params[0].value[4];
		            res += '<br/>  收盘 : ' + params[0].value[2] + '  最低 : ' + params[0].value[3];
		            return res;
				
		        },
			axisPointer : {
				animation : false,
				type : 'cross',
				lineStyle : {
					color : '#376df4',
					width : 2,
					opacity : 1
				}
			}
		},
		xAxis : {
			type : 'category',
			data : dates,
			axisLine : {
				lineStyle : {
					color : '#8392A5'
				}
			}
		},
		yAxis : {
			scale : true,
			axisLine : {
				lineStyle : {
					color : '#8392A5'
				}
			},
			splitLine : {
				show : false
			}
		},
		grid : {
			bottom : 80
		},
		dataZoom : [
				{
					textStyle : {
						color : '#8392A5'
					},
					handleIcon : 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
					handleSize : '80%',
					dataBackground : {
						areaStyle : {
							color : '#8392A5'
						},
						lineStyle : {
							opacity : 0.8,
							color : '#8392A5'
						}
					},
					handleStyle : {
						color : '#fff',
						shadowBlur : 3,
						shadowColor : 'rgba(0, 0, 0, 0.6)',
						shadowOffsetX : 2,
						shadowOffsetY : 2
					}
				}, {
					type : 'inside'
				} ],

		animation : false,
		series : [
				{
					type : 'candlestick',
					name : _cd,
					data : data,
					itemStyle : {
						normal : {
							color : '#FD1050',
							color0 : '#0CF49B',
							borderColor : '#FD1050',
							borderColor0 : '#0CF49B'
						}
					},
					
					//画线
					
					 markLine: {
						 symbol: ['none', 'none'],
						 itemStyle:{
					            normal:{lineStyle:{type:'solid',color:'#E800E8',width:'2'},label:{show:true,position:'left'}}
					            },
			             data: chan
			         },
			         
			         

					//画点
			         markPoint: {
			         data: point
			        /*
			         [
			        	 
		                    {
		                        name: 'XX标点',
		                        coord: ['2016-12-14', 8.61],
		                        value: 8.62,
		                        itemStyle: {
		                            normal: {color: 'rgb(41,60,85)'}
		                        }
		                    },
		                    
		                    {
		                        coord: ['2017-05-15', 8.63]
		                    }
		                    ]
		*/
			         }

				},

				{
					name : '短期线',
					type : 'line',
					data : calculateMA(20, data),
					smooth : true,
					showSymbol : false,
					lineStyle : {
						normal : {
							width : 1
						}
					}
				}, {
					name : '中期线',
					type : 'line',
					data : calculateMA(60, data),
					smooth : true,
					showSymbol : false,
					lineStyle : {
						normal : {
							width : 1
						}
					}
				}, {
					name : '年线',
					type : 'line',
					data : calculateMA(250, data),
					smooth : true,
					showSymbol : false,
					lineStyle : {
						normal : {
							width : 1
						}
					}
				}
				]
	};
	myChart.setOption(option, true);
	
	/*
	window.addEventListener("resize", function () {
		 
        option.chart.resize();

      });
      */
}
