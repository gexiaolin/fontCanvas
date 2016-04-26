$(function(){
	$('.controller').width(Math.min(800,$(window).width() - 20));
	var canvasWidth = Math.min(800,$(window).width() - 20);
	var canvasHeight = canvasWidth;
	var canvas = document.querySelector('#canvas');
	var ctx = canvas.getContext('2d');

	//将鼠标事件坐标点定在canvas画布中
	function windowToCanvas(x,y){
		var box = canvas.getBoundingClientRect();
		return{
			x:Math.round(x-box.left),
			y:Math.round(y-box.top)
		}
	}

	//米字格绘制
	function drawGrid(){
		ctx.save();

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		ctx.strokeStyle = '#2096d4';
		ctx.beginPath();
		ctx.moveTo(3,3);
		ctx.lineTo(canvasWidth - 3,3);
		ctx.lineTo(canvasWidth - 3,canvasHeight - 3);
		ctx.lineTo(3,canvasHeight - 3);
		ctx.closePath();
		ctx.lineWidth = 6;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(canvasWidth,canvasHeight);
		ctx.moveTo(0,canvasHeight);
		ctx.lineTo(canvasWidth,0);
		ctx.moveTo(0,canvasHeight/2);
		ctx.lineTo(canvasWidth,canvasHeight/2);
		ctx.moveTo(canvasWidth/2,0);
		ctx.lineTo(canvasWidth/2,canvasHeight);
		ctx.lineWidth = 1;
		ctx.stroke();

		ctx.restore();
	}

	//速度判断
	function calDistance(st,ed){
		return Math.sqrt( (st.x - ed.x)*(st.x - ed.x) + (st.y - ed.y) * ((st.y - ed.y)) );
	}

	//笔画粗细
	function calWidth(t,s){
		var v = s/t;
		var resultWidth;
		if(v <= 0.1){
			resultWidth = 15;
		}else if(v >= 15){
			resultWidth = 1;
		}else{
			resultWidth = 15 - (v - 0.1)/(10 - 0.1) * (15 - 1);//可以把0.1和1看作0来理解
		}
		if(lastLineWidth === -1){
			return resultWidth;
		}
		return resultWidth * 7/10 + resultWidth* 3/10;
	}

	drawGrid();

	var isMouseDown = false;
	var lastLoc = {x:0,y:0};
	var lastTimeStamp = 0;
	var lastLineWidth = -1;

	function beginStroke(point){
		isMouseDown = true;
		lastLoc = windowToCanvas(point.x,point.y);
		lastTimeStamp = new Date().getTime();
	}
	function endStroke(){
		isMouseDown = false;
	}
	function moveStroke(point){
		//draw;
		var curLoc = windowToCanvas(point.x,point.y);
		var curTimeStamp = new Date().getTime();
		var s = calDistance(curLoc,lastLoc);
		var t = curTimeStamp - lastTimeStamp;
		var lineWidth = calWidth(t,s);

		ctx.beginPath();
		ctx.moveTo(lastLoc.x,lastLoc.y);
		ctx.lineTo(curLoc.x,curLoc.y);
		ctx.strokeStyle = '#000';
		ctx.lineWidth = lineWidth;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.stroke();

		lastLoc = curLoc;
		lastTimeStamp = curTimeStamp;
		lastLineWidth = lineWidth;
	}

	canvas.onmousedown = function(ev){
		ev.preventDefault();
		beginStroke({x:ev.clientX,y:ev.clientY});
	}
	canvas.onmouseup = function(ev){
		ev.preventDefault();
		endStroke();
	}
	canvas.onmousemove = function(ev){
		ev.preventDefault();
		if(isMouseDown){
			moveStroke({x:ev.clientX,y:ev.clientY});
		}
	}
	canvas.onmouseout = function(ev){
		ev.preventDefault();
		endStroke();
	}

	canvas.addEventListener('touchstart',function(ev){
		ev.preventDefault();
		touch = ev.touches[0];
		beginStroke({x:touch.pageX,y:touch.pageY});
	})
	canvas.addEventListener('touchmove',function(ev){
		ev.preventDefault();
		touch = ev.touches[0];
		if(isMouseDown){
			moveStroke({x:touch.pageX,y:touch.pageY});
		}
	})
	canvas.addEventListener('touchend',function(ev){
		ev.preventDefault();
		endStroke();
	})

	$('.del').on('click',function(){
		ctx.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	})
})