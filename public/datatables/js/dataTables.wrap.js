function showDataTable4os(jsondata,tableId){	
	//console.info($('#'+tableId).DataTable());
	var dataSet = jsondata._d.bt_data;
	var columnsSet = jsondata._d.bt_dis;
	$.fn.dataTable.ext.errMode = 'none';
	$('#div_'+tableId).empty();
	
	$('#div_'+tableId).append("<table id=\""+tableId+"\" class=\"display cell-border\" cellspacing=\"0\" width=\"100%\" ></table>");  
			
	var dt = $('#'+tableId).DataTable({
        "language" : {"url": "../public/datatables/js/Chinese.json" },
		data : dataSet,
		columns : columnsSet
	});
	
	add_dt_Event(dt,tableId);
}


function showDataTable(jsondata,tableId){	
	//console.info($('#'+tableId).DataTable());
	var dataSet = jsondata.bt_data_1;
	var columnsSet = jsondata.bt_dis_1;
	$.fn.dataTable.ext.errMode = 'none';
	$('#div_'+tableId).empty();
	
	$('#div_'+tableId).append("<table id=\""+tableId+"\" class=\"display cell-border\" cellspacing=\"0\" width=\"100%\" ></table>");  
			
	var dt = $('#'+tableId).DataTable({
        "language" : {"url": "../public/datatables/js/Chinese.json" },
		data : dataSet,
		columns : columnsSet
	});
	
	add_dt_Event(dt,tableId);
}



function add_dt_Event(dt,tableId){
	//高亮
	$('#'+tableId+' tbody').on('mouseenter', 'tr', function(){
		$(this).addClass('highlight');
	});
	$('#'+tableId+' tbody').on('mouseleave', 'tr', function(){
		$(this).removeClass('highlight');
	});
	
	//单选		
	  $('#'+tableId+' tbody').on( 'click', 'tr', function () {
		  //$(this).toggleClass('selected');  //多选
	        if ( $(this).hasClass('selected') ) {
	            $(this).removeClass('selected');
	        }
	        else {
	            dt.$('tr.selected').removeClass('selected');
	            $(this).addClass('selected');
	        }
	    } );
	
}

function add_Event_detail(dt,tableId){
	//detail event-------------
	var detailRows = [];
	$('#'+tableId+' tbody').on('click', 'tr td.details-control', function() {
		var tr = $(this).closest('tr');
		var row = dt.row(tr);
		var idx = $.inArray(tr.attr('id'), detailRows);
		
		
		if (row.child.isShown()) {
			tr.removeClass('details');
			row.child.hide();

			// Remove from the 'open' array
			detailRows.splice(idx, 1);
		} else {
			tr.addClass('details');
			row.child(format_dt_detail(row.data())).show();

			// Add to the 'open' array
			if (idx === -1) {
				detailRows.push(tr.attr('id'));
			}
		}
	});

	// On each draw, loop over the `detailRows` array and show any child rows
	dt.on('draw', function() {
		$.each(detailRows, function(i, id) {
			$('#' + id + ' td.details-control').trigger('click');
		});
	});
}

function format_dt_detail(d){
	var detailinfo = "a,b,cd,d,f,g";
	var arrd = String(d).split(",");
	var detail = "detail: "+detailinfo+"<br>"
	for( var i=0;i<arrd.length;i++){
		detail = detail + "#"+(i+1)+"   "+arrd[i]+"<br>";
	}
	return detail;
}


var c;
function jump(day){
	var a = $("input[name='stockName']").val();
	if(a == ""){
		layer.msg("请输入股票代码");
		return;
	}
	var b = $("input[name='stockPasswd']").val();
	
	if(b == ""){
		b = c;
	}else{
		c = b;
	}
	
	
	var baseURL = "https://money.finance.sina.com.cn/quotes_service/api/json"+b+".php";
	var stockCode = a;//股票代码
	var scale = day;//数据周期  日线240
	var datalen = "400";//个数
	var now = new Date().getTime();
	var paramName = "_"+stockCode+"_"+scale+"_"+now;//_sz000731_5_1518135258158
	var url = baseURL+"/var%20"+paramName+"=/CN_MarketData.getKLineData?symbol="+stockCode+"&scale="+scale+"&ma=no&datalen="+datalen;
	
	
	$.ajax({'url':url, 'dataType':'jsonp'}).always(function(d){kline(window[paramName],"kk")});
}

function kkformatData(jsonData){
	var adata = [];
	var i=0;
	for(var o in jsonData){
		var sdata = [];
		sdata[0] = jsonData[o].day;
		sdata[1] = jsonData[o].open;
		sdata[2] = jsonData[o].close;
		sdata[3] = jsonData[o].low;
		sdata[4] = jsonData[o].high;
		adata[i] = sdata;
		i++;
      }  

	var day = [];
	var open = [];
	var close = [];
	var low = [];
	var high = [];
	for(var j=0;j<i;j++){
		day[j] = adata[i-1-j][0];
		open[j] = adata[i-1-j][1];
		close[j] = adata[i-1-j][2];
		low[j] = adata[i-1-j][3];
		high[j] = adata[i-1-j][4];
	}
	
	
	layuitableInsert("day",day);
	layuitableInsert("open",open);
	layuitableInsert("close",close);
	layuitableInsert("low",low);
	layuitableInsert("high",high);
	
	chan(day,open,close,low,high);
	return adata;
}
