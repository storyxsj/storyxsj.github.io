
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
