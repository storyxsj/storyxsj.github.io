function menu4pen() {
	var clicked = "Nope.";
	var mausx = "0";
	var mausy = "0";
	var winx = "0";
	var winy = "0";
	var difx = mausx - winx;
	var dify = mausy - winy;

	$("html").mousemove(
			function(event) {
				mausx = event.pageX;
				mausy = event.pageY;
				winx = $(".penMenuMain").offset().left;
				winy = $(".penMenuMain").offset().top;
				if (clicked == "Nope.") {
					difx = mausx - winx;
					dify = mausy - winy;
				}

				var newx = event.pageX - difx
						- $(".penMenuMain").css("marginLeft").replace('px', '');
				var newy = event.pageY - dify
						- $(".penMenuMain").css("marginTop").replace('px', '');
				
				if(newx < 0 ){
					newx = 1;
				}
				if(newy < 0){
					newy = 1;
				}
				$(".penMenuMain").css({
					top : newy,
					left : newx
				});

				// $(".container").html("Mouse Cords: " + mausx + " , " + mausy + "<br />" + "Window Cords:" + winx + " , " + winy + "<br />Draggin'?: " + clicked + "<br />Difference: " + difx + " , " + dify + "");
			});

	$(".penMenuHead").mousedown(function(event) {
		clicked = "Yeah.";
	});

	$("html").mouseup(function(event) {
		clicked = "Nope.";
	});
}


function menuResize(elementid){
	
	 var target=document.getElementById("menubody");
	var movemenu = document.getElementById("movemenu");
	var menuResize = document.getElementById("menuResize");
	
	 if(target.style.display=="none"){

		 target.style.display="block";
		 movemenu.style.height="150px";
		 movemenu.style.width="350px";
		 menuResize.innerText = "—";
		 menuResize.title="最小化";
	 }else{

		 target.style.display="none";
		 movemenu.style.height="30px";
		 movemenu.style.width="80px";
		 menuResize.innerText = "＋";
		 menuResize.title="最大化";
	 }
	 

}