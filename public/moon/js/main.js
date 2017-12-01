function main_init(){
	layuitableInsert("_appid","xsj");	 
	layuitableInsert("username","admin");
	layuitableInsert("password","admin");
	layuitableInsert("domain","Default");
}

function layuitableInsert(k,v){
	layui.data('layuitable', 
			  {key: k ,value: v}
		);	 
}




function os_buildRst(command,ext){
	var _appid = layui.data('layuitable')._appid;
	var username = layui.data('layuitable').username;
	var password = layui.data('layuitable').password;
	var domain = layui.data('layuitable').domain;


	var rsq = {};
	rsq["_appid"] = _appid;
	rsq["command"] = command;
	
	var param = {};
		param["username"] = username;
		param["userpassword"] = password;
		param["domain"] = domain;
	//put ext to param
	if( undefined != ext){
		var mjson = JSON.parse(ext);
		for(var p in mjson){//遍历json对象的每个key/value对,p为key
			param[p] = mjson[p];
			}
	}
	
	rsq["param"] = param;
	
	return JSON.stringify(rsq);
}

var excuteFunc = function(funcName,data,divId,a,b,c){
　　　　funcName(data,divId,a,b,c);
}



/**
 * 
 * @param url   URL
 * @param method 回调方法
 * @param divId 回调方法的第2个参数，其中第1个参数为url的返回数据
 * @param a 回调方法的第3个参数
 * @param b 回调方法的第4个参数
 * @param c 回调方法的第5个参数
 * @returns
 */
function te3ajax(url,method,divId,a,b,c){
	layer.msg("请求己受理");
	$.ajax({ 
		url: url,
		cache: false ,
		dataType: "html",
		success: function(data){
			
			data = JSON.parse(data);
			//data = eval(data);
			
			if("Err" == data._r ){
				layer.msg("操作失败"+eval(data._p));
				return;
			}
			
			if( undefined == method){
				layer.msg("undefined");
			}else{
				parent.layer.msg("操作成功");
				excuteFunc(eval(method),data,divId,a,b,c);
			}
			
		},
		error:function(data){
			testjs();
		}
	});
}


function te3ajaxp(url,method,a,b,c){
	
	$.ajax({ 
		url: url,
		cache: false ,
		dataType: "jsonp",
		jsonp:"var%20_sz000731_5_1508135258158=",    
		jsonpCallback:"success_jsonp",
		success: function(data){
			
			if( undefined == method){
				console.info("undefined");
			}else{
				excuteFunc(method,data,a,b,c);
			}
			
		},
		error:function(data){
			
			console.info("error"+data);
		}
	});
}

//-------------------

function osqueryWrap(data,tableId,queryCmd){
	osquery(tableId,queryCmd);
}

function osquery(tableId,queryCmd){
	var queryMsg = os_buildRst(queryCmd);
	var url = "os_call.do?msg="+queryMsg;
	te3ajax(url,showDataTable4os,tableId);
}

function osSubmit(command,msg,method){
	var url = "os_call.do?msg="+os_buildRst(command,msg);
	te3ajax(url,method);
}

function osdelete(tableId,deleteCmd,queryCmd){
	
	var table = $('#'+tableId).DataTable();
	var selectData = table.rows('.selected').data();
	var len = selectData.length;
	if(0 == len){
		_noselectRecord();
	}else{
		var row = selectData[0];
		
		jConfirm("确认执行该操作?", 
				"提示信息", 
				function(r) {
		   			 if(r){//此处输入你要执行的操作
		   				var tempId = String(row).split(",")[0];
		   				
		   				var ext={};
		   				ext["id"] = tempId; 
		   				
		   				var msg = os_buildRst(deleteCmd,JSON.stringify(ext));
		   				var deleteUrl = "os_call.do?msg="+msg;

		   				te3ajax(deleteUrl,"osqueryWrap",tableId,queryCmd);
		    			}
		});
	}
}


//-------------------


function te3query(data,tableId,uri,msg){
	var url = uri+".do?msg="+msg;
	te3ajax(url,showDataTable4os,tableId);
}

function te3open(url){
	layer.open({
		  type: 2,
		  title:'新建',
		  area: ['700px', '450px'],
		  fixed: true, //不固定
		  maxmin: true,
		  content: url
		});
}

function te3updateCheck(divId){
	var table = parent.$('#'+divId).DataTable();
	var selectData = table.rows('.selected').data();
	
	var len = selectData.length;
	if(0 == len){
		parent.layer.msg("请选择要操作的记录");
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	}else{
		updateInit(selectData[0]);
	}
}


function te3del(tableId,deleteUri,queryUri){
	
	var table = $('#'+tableId).DataTable();
	var selectData = table.rows('.selected').data();
	var len = selectData.length;
	if(0 == len){
		_noselectRecord();
	}else{
		var row = selectData[0];
		
		jConfirm("确认执行该操作?", 
				"提示信息", 
				function(r) {
		   			 if(r){//此处输入你要执行的操作
		   				var tempId = String(row).split(",")[0];
		   				var deleteUrl = deleteUri+".do?tempId="+tempId;

		   				te3ajax(deleteUrl,"te3query",tableId,queryUri);
		    			}
		});
	}
}


function akso_new(html){
	$("#akso-main").empty();
	$("#akso-main").load(html);
}

function testjs(){
	jAlert("服务器异常",
			"提示信息");
}

function working(){
	jAlert("开发中",
			"提示信息");

}

function _redLineisEmpt(){
	jAlert("标红的项不能为空",
			"提示信息");
}

function _noselectRecord(){
	jAlert("请选中要操作的记录",
			"提示信息");
}



function _postWithConfirm(action,uri,isNewWindows){
	jConfirm("确认执行该操作?", 
			"提示信息", 
			function(r) {
	   			 if(r){//此处输入你要执行的操作
	    			submit_extended(action,uri,isNewWindows);
	    			}
	});
}






function selectColumn(command){
	
	var table = $('#example').DataTable();
	var selectData = table.rows('.selected').data();
	var len = selectData.length;
	if(0 == len){
		_noselectRecord();
	}else{
		var row = selectData[0];
		startwork(row,command);
		
	}
}



/* ************************ 加载页面 start ************************ */
/* 创建加载页面 */
function loadingCreate(){
	$('body').append('<div class="load_m"></div><div class="load_c"><img src="../public/moon/images/load.gif"/></div>');
	
}
/* 删除加载页  */
function loadingDelete(){
	$('.load_m', window.parent.document).remove();
	$('.load_c', window.parent.document).remove();
}
/* 初始化加载页面 */

function sleep(n) { //n表示的毫秒数
    var start = new Date().getTime();
    while (true) if (new Date().getTime() - start > n) break;
} 
/* ************************ 加载页面 end ************************ */

