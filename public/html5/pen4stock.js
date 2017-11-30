var myversion = "0.1";


var defaultFont = "20px Georgia";//默认字体
var defaultStrokeStyle = "blue";//画线颜色
var defaultLineWidth = 3;// 设置笔触的宽度
var defaultFillStyle = "rgba(255,22,0,0.2)"; //填充颜色 #3333CC
var defaultNodeWidth = "60";//Node 宽
var defaultNodeHeight = "40";//Node 高
var defaultR = "30";//圆半径
var defaultTextHeith = "20";//字体高度
var defaultBGLineStep=45;// 方格大小
var defaultBGLinespace=7;// 虚线密集程度
var defaultBGLineWidth = 0.4;//背景线宽
var PenDefaultMesSplit = ",";

//var args = Array.prototype.slice.call(arguments);  
// arguments.length

//在给定的divID生成html5 canvas
function createCanvas(divId){
	var div = document.getElementById(divId);
	//div.innerHTML = "";//获取canvas
	var canvas = document.createElement('canvas');
	canvas.height = div.offsetHeight;
	canvas.width = div.offsetWidth;
	
	div.appendChild(canvas);//获取canvas
	return canvas;
}

/**
 * 
 * @param pen
 * @param dashLineStep 方格大小
 * @param dashLinespace 虚线密集程度
 * @param dashLineWidth 虚线宽度
 * @returns
 */
function initBg(pen,dashLineStep,dashLineSpace,dashLineWidth){
	pen.context.lineWidth = dashLineWidth;//线宽
	
	for(var i=dashLineStep;parseInt(i)<parseInt(pen.canvas.height);i=parseInt(i)+parseInt(dashLineStep)){
		pen.drawDashedLine(0,i,pen.canvas.width,i,dashLineSpace);
	}
	
	for(var j=dashLineStep;parseInt(j)<parseInt(pen.canvas.width);j=parseInt(j)+parseInt(dashLineStep)){
		pen.drawDashedLine(j,0,j,pen.canvas.height,dashLineSpace);
	}

	pen.context.strokeRect(0, 0, pen.canvas.width, pen.canvas.height);
}

function Pen(canvasId, isTest) {
	
	var pen = this;
	
	this.canvas=createCanvas(canvasId);
	this.context = this.canvas.getContext('2d');

	initBg(pen,defaultBGLineStep,defaultBGLinespace,defaultBGLineWidth);

	this.isScrawl = false;//涂鸦
	this.isDrawLine = false;//画线
	this.isDrag = true;//拖动
	this.isReadOnly = false;
	this.opt;
	
	this.isTest = isTest;
	this.isClick = false;//点击
	this.cashNodeList = [];
	this.cashLineList = [];
	var x0;//初始x坐标
	var y0;//初始y坐标
	var x1;//运动中的x坐标
	var y1;//运动中的y坐标
	var e = e || event;
	
	var selectedElement;
	var clickElement;
	
	//TODO move
	this.canvas.onmousemove = function(e) {//移动---------

		e = e || event;
		x1 = e.clientX - pen.canvas.offsetLeft+document.body.scrollLeft;
		y1 = e.clientY - pen.canvas.offsetTop+document.body.scrollTop;
	
		if(pen.isClick){//点击状态===============================================
			if(pen.isScrawl){
				pen.drawLine(x0, y0, x1, y1);
				x0=x1;
				y0=y1;
			}else if(pen.isDrawLine){
				pen.reDraw();
				pen.drawLine(x0, y0, x1, y1);
			}else if(pen.isDrag){
				
				if(pen.selectedElement != null && pen.selectedElement.type=="node"){
					pen.selectedElement.x=parseInt(pen.selectedElement.x)+parseInt(x1)-parseInt(x0);
					pen.selectedElement.y=parseInt(pen.selectedElement.y)+parseInt(y1)-parseInt(y0);
					x0=x1;
					y0=y1;
					pen.reDraw();
				}
			}
		}else{//非点击状态======================================================
			if((pen.isDrag && pen.clickElement==null) ){
				var element = pen.select("all",x1,y1);
				if(null != element){
					//console.info(element.name+" is selected");
					pen.selectedElement = element;
					if(pen.clickElement == null){
						pen.reDraw();
					}
				}else{
					if(pen.selectedElement != null  ){
						pen.selectedElement = null;
						if(pen.clickElement == null){
							pen.reDraw();
						}
					}
				}
			}else if(pen.isReadOnly){
				var element = pen.select("all",x1,y1);
				if(element != null){
					pen.reDraw();
				}
			}
		}

	};
	
	/**TODO click
	 * 点击事件 识别所有元素中被击中的设为clickElement
	 *          点击空白处,方才被击中的才设为null
	 */
	this.canvas.onmousedown = function(e) {//点击---------
		
		if(pen.isReadOnly){
			return;
		}
		
		e = e || event;
		x0 = e.clientX - pen.canvas.offsetLeft + document.body.scrollLeft;
		y0 = e.clientY - pen.canvas.offsetTop + document.body.scrollTop;
		
		pen.isClick = true;
		
		
		var element = pen.select("all",x1,y1);
		pen.selectedElement = element;
		
		if(pen.clickElement != null){
			pen.clickElement.isclicked = false;
		}
		
		if(pen.selectedElement != null){
			pen.clickElement = pen.selectedElement;
			pen.clickElement.isclicked = true;
		}else{
			pen.clickElement = null;
		}
		
		if(pen.isDrag){
			pen.reDraw();
		}
		
		
		console.info("ClickOn:" + x0 + " " + y0);
		
		//TODO mouseup 
		document.onmouseup = function(e) {
			
			pen.isClick = false;
			
			
			if(pen.isDrawLine){
				var startNode = pen.select("node",x0,y0);
				var endNode = pen.select("node",x1,y1);
				console.info(endNode!=null);
				if(startNode != null && endNode != null){
					var line = new pen.Line("line#"+startNode.name+"_"+endNode.name);
					line.link(startNode,endNode);
					line.draw();
					
				}
				pen.reDraw();
			}
			
			/*
			e = e || event;
			var x_up = e.clientX - pen.canvas.offsetLeft + document.body.scrollLeft;;
			var y_up = e.clientY - pen.canvas.offsetTop + document.body.scrollTop;
			console.info("Up:" + x_up + " " + y_up);
			*/
		};
		
	}//onmousedown event end-------------------------

	//TODO 
	/**
	 * Pen: which is select	
	 *      flag: all, line, node 
	 *      x:
	 */
	this.select = function(flag,x,y) {
		var hasElementSelected = false;//是否有元素己被选中？ true-是  false-否
		var selectElement;
		if("all"==flag || "line"==flag){//先查看线是否被选中，因为线不好点:(
			for (var i = 0; i < pen.cashLineList.length; i++) {
				var c = pen.cashLineList[i];
				if (c.isSelected(x, y, hasElementSelected) && !hasElementSelected) {
					hasElementSelected = true;//有选中的，但是不退出，因为要清除上一次己被选中的状态
					selectElement = c;
				}
			}
		}
		if("all"==flag || "node"==flag){
			for (var i = 0; i < pen.cashNodeList.length; i++) {
				var c = pen.cashNodeList[i];
				if (c.isSelected(x, y, hasElementSelected) && !hasElementSelected) {
					hasElementSelected = true;//有选中的，但是不退出，因为要清除上一次己被选中的状态
					selectElement = c;
				}
			}
		}
		return selectElement;
	}
	
	//TODO PEN reDraw
	this.reDraw = function(){
		var isRedraw = true;
		pen.canvas.width = pen.canvas.width;
		initBg(pen,defaultBGLineStep,defaultBGLinespace,defaultBGLineWidth);
		
		var deletePox = -1;
		if(pen.isDrag ||  pen.isDrawLine || pen.isReadOnly){
			
			for(var i=0;i<pen.cashNodeList.length;i++){
				var c=pen.cashNodeList[i];

				if(c.isclicked && pen.opt == "delete"){
					deletePox = i;
					console.info("delete:"+c.name);
				}else{
					c.draw(isRedraw);	
				}
			}
			
			if(deletePox != -1){
				pen.cashNodeList.splice(deletePox,1);
			}else{

				if(pen.opt == "creatNode"){
					var node =  new pen.Node("node-123");
					node.setLocation(200,200);
					node.draw();	
				}else if(pen.opt == "creatChoice"){
					var node =  new pen.Choice("choice-123");
					node.setLocation(200,200);
					node.draw();	
				}if(pen.opt == "creatCircle"){
					var node =  new pen.Circle("circle-123");
					node.setLocation(200,200);
					node.draw();	
				}
			
			}
			
			for(var i=0;i<pen.cashLineList.length;i++){
				var c=pen.cashLineList[i];
				if(c.isclicked && pen.opt == "delete"){
					deletePox = i;
					console.info(c.name+":"+i);
				}else{
					c.draw(isRedraw);	
				}
			}
			
			if(deletePox != -1){
				pen.cashLineList.splice(deletePox,1);
			}
			
		}
	}
	
	

	//TODO	Node
	this.KLine = function(name){
		var kline = this;
		
		return kline;
	};
	
	this.Node = function(name) {
		var node=this;
		node.name = name;
		this.type = "node";
	
		this.select = false;
		this.isclicked = false;
		this.x = 0;
		this.y = 0;
		this.w = defaultNodeWidth;
		this.h = defaultNodeHeight;
		this.image;

		this.setImage = function(image) {
			this.image = image;
		};
		
		this.setLocation = function(x, y) {
			this.x = x;
			this.y = y;
		};
		
		this.isSelected = function(xn,yn,hasElementSelected){
			if(hasElementSelected){
				this.select=false;
				return this.select;
			}

			if(xn>this.x && xn<parseInt(this.x)+parseInt(this.w) && yn>this.y && yn<parseInt(this.y)+parseInt(this.h)){
				this.select=true;
			}else{
				this.select=false;
			}
			return this.select;
		};
		
		this.draw = function(isRedraw) {
			pen.reset();
			
			if(null != this.image){
				var img=new Image();
				img.onload = function () {
						pen.context.drawImage(img,node.x,node.y);
						
						node.w = img.width;
						node.h = img.height;
						
						if(name != null){
							//居中
							var Textwidth=pen.context.measureText(name).width;		
							var x_text = node.x+(img.width-Textwidth)/2;
							//图像下方
							var y_text = parseInt(node.y)+img.height+parseInt(defaultTextHeith);
							
							pen.drawText(node.name,x_text,y_text);
						}
				 	};

				img.src=this.image;   
			}else{
				
				pen.drawRect(this.x, this.y, this.w, this.h);

				if(name != null){
					//居中
					var Textwidth=pen.context.measureText(name).width;		
					var x_text = this.x+(this.w-Textwidth)/2;
					//图像下方
					var y_text = parseInt(this.y)+parseInt(this.h)+parseInt(defaultTextHeith);
					
					pen.drawText(this.name,x_text,y_text);
				}
			}
			
			if(this.select){
				//this.context.fillStyle = defaultFillStyle;
				pen.context.fillRect(parseInt(this.x)-5, parseInt(this.y)-5, 
						parseInt(this.w)+10, parseInt(this.h)+10);
				
				var mes = "name:"+node.name+PenDefaultMesSplit+"x:"+this.x
				pen.hoverTip(this.x,this.y,mes);
			}
			
			if(!isRedraw){
				pen.cashNodeList.push(node);
			}
			
		};

		

		return node;
	};
	
	
	
	
	
	
	//TODO	Line
	this.Line = function(name) {
		var line=this;
		
		this.type = "line";
		
		this.select = false;
		this.isclicked = false;
		this.name = name;
		this.startNode;
		this.endNode;
		
		this.link = function(startNode,endNode) {
			this.startNode = startNode;
			this.endNode = endNode;
		};
		
		this.isSelected = function(xn,yn,hasElementSelected){
			
			if(hasElementSelected){
				this.select=false;
			}else{
				var x0 = this.startNode.x;
				var y0 = this.startNode.y;
				var x1 = this.endNode.x;
				var y1 = this.endNode.y;
				this.select = pen.isPointOnLine(x0,y0,x1,y1,xn,yn);
			}
			
			return this.select ;
		};
		
		this.draw = function(isRedraw){
			pen.reset();
			var x0 = this.startNode.x;
			var y0 = this.startNode.y;
			var x1 = this.endNode.x;
			var y1 = this.endNode.y;

			if(this.select){
				pen.setLineWidth(6);
				pen.setStrokeStyle("#CC99CC");
				pen.fillLine(x0, y0, x1, y1);
				//pen.drawLine(x0, y0, x1, y1);
				pen.setLineWidth(pen.defaultLineWidth);
			}
			
			pen.drawLine(x0, y0, x1, y1);
			
			if(!isRedraw){
				pen.cashLineList.push(line);
			}
		};
		return line;
	};

	return this;
}





//TODO prototype
Pen.prototype = {

	hoverTip : function(x, y, mes) {
		
			this.context.fillStyle = "rgba(54,62,79,0.95)";
			this.context.font = "14px Microsoft YaHei";
			this.context.textAlign = "left";
			this.context.fillRect(x - 100, y - 100, 100, 100);
			this.context.fillStyle = "#fff";
			
			var mesArr = mes.split(PenDefaultMesSplit);
			
			for(var i=0;i<mesArr.length;i++){
				this.context.fillText(mesArr[i], x - 100 + 7, y - 100 + 20*(parseInt(i)+parseInt(1)));
			}
			
		

	},

	isPointOnLine : function(x0, y0, x1, y1, xn, yn) {
		var inRect = false;
		if (Math.abs(parseInt(x0 - x1)) == parseInt(Math.abs(parseInt(x0 - xn)))
				+ parseInt(Math.abs(parseInt(x1 - xn)))
				&& Math.abs(parseInt(y0 - y1)) == parseInt(Math.abs(parseInt(y0
						- yn)))
						+ parseInt(Math.abs(parseInt(y1 - yn)))) {
			inRect = true;
		}

		var key = (y0 - y1) * xn + (x1 - x0) * yn + x0 * y1 - x1 * y0;
		key = Math.abs(key);

		if (key < 500 && inRect) {
			return true;
		} else {
			return false;
		}
	},

	drawRect : function(x, y, w, h) {
		this.reset();
		this.context.strokeRect(x, y, w, h);
	},
	
	fillCircle : function(x, y, r){
		this.context.save();
		this.context.moveTo(x, y - r);
		this.context.beginPath();
		this.context.arc(x, y, r, 2 * Math.PI, 0, true);
		this.context.fill();
		this.context.closePath();
		this.context.restore();
	},
	
	drawCircle : function(x, y, r) {
		this.context.save();
		this.context.moveTo(x, y - r);
		this.context.beginPath();
		this.context.arc(x, y, r, 2 * Math.PI, 0, true);
		this.context.stroke();
		this.context.closePath();
		this.context.restore();
	},
	
	drawXLine : function(list,isClose) {
		this.reset();
		this.context.save();

		this.context.beginPath();////开启新路近
		
		if(list.length < 2){
			console.info(111);
			return;
		}
		var xy = list[0].split(",");
		
		//设定笔触的位置
		this.context.moveTo(xy[0], xy[1]);
		for(var i=1;i<list.length;i++){
			var xy2 = list[i].split(",");
			//设置移动的位置
			this.context.lineTo(xy2[0], xy2[1]);
		}
		if(isClose){
			this.context.lineTo(xy[0], xy[1]);
		}
		
		//画线
		this.context.stroke();//这个时候的线已经出来了
		
		
		//关闭路径
		this.context.closePath();//凡事路径图形必须先开始路径,画完之后必须结束路径
		this.context.restore();
	},
	
	fillXLine : function(list,isClose) {
		this.reset();
		this.context.save();

		this.context.beginPath();////开启新路近
		
		if(list.length < 2){
			console.info(111);
			return;
		}
		var xy = list[0].split(",");
		
		//设定笔触的位置
		this.context.moveTo(xy[0], xy[1]);
		for(var i=1;i<list.length;i++){
			var xy2 = list[i].split(",");
			//设置移动的位置
			this.context.lineTo(xy2[0], xy2[1]);
		}
		if(isClose){
			this.context.lineTo(xy[0], xy[1]);
		}
		
		//画线
		this.context.fill();//这个时候的线已经出来了
		
		
		//关闭路径
		this.context.closePath();//凡事路径图形必须先开始路径,画完之后必须结束路径
		this.context.restore();
	},

	drawLine : function(x0, y0, x1, y1) {
		this.context.save();

		this.context.beginPath();////开启新路近

		//设定笔触的位置
		this.context.moveTo(x0, y0);
		//设置移动的位置
		this.context.lineTo(x1, y1);
		//画线
		this.context.stroke();//这个时候的线已经出来了
		//关闭路径
		this.context.closePath();//凡事路径图形必须先开始路径,画完之后必须结束路径
		this.context.restore();
	},

	drawDashedLine : function(fromX, fromY, toX, toY, pattern) {

		// default interval distance -> 5px
		if (typeof pattern === "undefined") {
			pattern = 5;
		}
		// calculate the delta x and delta y
		var dx = (toX - fromX);
		var dy = (toY - fromY);
		var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
		var dashlineInteveral = (pattern <= 0) ? distance
				: (distance / pattern);
		var deltay = (dy / distance) * pattern;
		var deltax = (dx / distance) * pattern;
		// draw dash line
		this.context.beginPath();
		for (var dl = 0; dl < dashlineInteveral; dl++) {
			if (dl % 2) {
				this.context.lineTo(fromX + dl * deltax, fromY + dl * deltay);
			} else {
				this.context.moveTo(fromX + dl * deltax, fromY + dl * deltay);
			}
		}
		this.context.stroke();
	},

	fillLine : function(x0, y0, x1, y1) {
		this.context.save();

		this.context.beginPath();////开启新路近

		//设定笔触的位置
		this.context.moveTo(x0, y0);
		//设置移动的位置
		this.context.lineTo(x1, y1);
		//画线
		this.context.fill();//这个时候的线已经出来了
		//关闭路径
		this.context.closePath();//凡事路径图形必须先开始路径,画完之后必须结束路径
		this.context.restore();
	},

	drawText : function(text, x, y) {
		this.context.save();
		this.context.beginPath();////开启新路近
		this.context.fillStyle = "#3333CC";//rgba(255,22,0,0.2)
		this.context.fillText(text, x, y);
		this.context.closePath();//凡事路径图形必须先开始路径,画完之后必须结束路径
		this.context.restore();
	},

	//画线颜色
	setStrokeStyle : function(strokeStyle) {
		this.context.strokeStyle = strokeStyle;
	},
	//画线粗细
	setLineWidth : function(lineWidth) {
		this.context.lineWidth = lineWidth;
	},
	//填充颜色及透明度
	setFillStyle : function(fillStyle) {
		this.context.fillStyle = fillStyle;
	},
	//设置字体
	setFont : function(font) {
		this.context.font = font;
	},
	//重置成默认值
	reset : function() {
		this.context.strokeStyle = defaultStrokeStyle;
		this.context.lineWidth = defaultLineWidth;
		this.context.fillStyle = defaultFillStyle;
		this.context.font = defaultFont;
	},
	selectModel : function(m) {
		if (m == "line") {//开启画线
			this.isScrawl = false;
			this.isDrawLine = true;
			this.isDrag = false;
			this.isReadOnly = false;
		} else if (m == "drag") {//开启可拖动
			this.isScrawl = false;
			this.isDrawLine = false;
			this.isDrag = true;
			this.isReadOnly = false;
		} else if (m == "scrawl") {
			this.isScrawl = true;
			this.isDrawLine = false;
			this.isDrag = false;
			this.isReadOnly = false;
		} else if (m == "readOnly") {
			this.isScrawl = false;
			this.isDrawLine = false;
			this.isDrag = false;
			this.isReadOnly = true;
		}
	},
	edit : function(opt){
		
		if(this.isReadOnly || this.isScrawl || this.isDrawLine ){
			return;
		}
		this.opt = opt;
		
		this.reDraw();
		
		this.opt = null;
		
	},

	Version : function() {
		console.info("pen.js version=[" + myversion + "]");
	}
}
