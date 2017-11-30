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
