var canvas = document.getElementByID("paint");
var ctx = canvas.getContext("2d");
var width = canvas.width, height = canvas.height;
var curX, curY, prevX, prevY;
var hold = false;
var fillValue = true, strokeValue = false;
var canvasData = {"pencil": [], "line": [], "rectangle": [], 
"circle": [], "eraser": []};
ctx.lineWidth = 2;

function color(colorValue)
{
	ctx.strokeStyle = colorValue;
	ctx.fillStyle = colorValue;
}

function addPixel()
{
	ctx.lineWidth += 1;
}

function reducePixel()
{
	if(ctx.lineWidth == 2)
		return;
	else
		ctx.lineWidth -= 1;
}

function fill()
{
	fillValue = true;
	strokeValue = false;
}

function outline()
{
	fillValue = false;
	strokeValue = true;
}

function reset()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvasData = {"pencil": [], "line": [], "rectangle": [], 
"circle": [], "eraser": []};
}

function pencil()
{
	canvas.onmousedown = function(e)
	{
		curX = e.clientX - canvas.offsetLeft;
		curY = e.clientY - canvas.offsetTop;
		hold = true;

		prevX = curX;
		prevY = curY;
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
	};

	canvas.onmousemove = function(e)
	{
		if(hold)
		{
			curX = e.clientX - canvas.offsetLeft;
			curY = e.clientY - canvas.offsetTop;
			draw();
		}
	};

	canvas.onmouseup = function(e)
	{
		hold = false;
	}

	canvas.onmouseout = function(e)
	{
		hold = false
	};

	function draw()
	{
		ctx.lineTo(curX, curY);
		ctx.stroke();
		canvasData.pencil.push({"startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle});
	}
}

function line()
{
	canvas.onmousedown = function(e)
	{
		img = ctx.getImageData(0, 0, width, height);
		prevX = e.clientX - canvas.offsetLeft;
		prevY = e.clientY - canvas.offsetTop;
		hold = true;
	};

	canvas.onmousemove = function(e)
	{
		if(hold)
		{
			ctx.putImageData(img, 0, 0);
			curX = e.clientX - canvas.offsetLeft;
			curY = e.clientY - canvas.offsetTop;
			ctx.beginPath();
			ctx.moveTo(prevX, prevY);
			ctx.lineTo(curX, curY);
			ctx.stroke();
			canvasData.line.push({"starx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle});
			ctx.closePath();
		}
	};
	
	canvas.onmouseup = function(e)
	{
		hold = false;
	}

	canvas.onmouseout = function(e)
	{
		hold = false;
	}
}

function rectangle()
{
	canvas.mousedown = function(e)
	{
		img = ctx.getImageData(0, 0, width, height);
		prevX = e.clientX - canvas.offsetLeft;
		prevY = e.clientY - canvas.offsetTop;
		hold = true;
	}

	canvas.onmousemove = function(e)
	{
		if(hold)
		{
			ctx.putImageData(img, 0, 0);
			curX = e.clientX - canvas.offsetLeft - prevX;
			curY = e.clientY - canvas.offsetTop - prevY;
			ctx.strokeRect(prevX, prevY, curX, curY);
			
			if(fillValue)
			{
				ctx.fillRect(prevX, prevY, curX, curY);
			}

			canvasData.rectangle.push({"starx": prevX, "stary": prevY, "width": curX, "height": curY, "thick": ctx.lineWidth, "stroke": strokeValue, "strokeColor": ctx.strokeStyle, "fill": fillValue, "fillColor": ctx.fillStyle});
		}
	};

	canvas.onmouseup = function(e)
	{
		hold = false;
	};

	canvas.onmouseout = function(e)
	{
		hold = false;
	};
}

function circle()
{
	canvas.onmousedown = function(e)
	{
		img = ctx.getImageData(0, 0, width, height);
		prevX = e.clientX - canvas.offsetLeft;
		prevY = e.clientY - canvas.offsetTop;
		hold = true;
	};

	canvas.onmousemove = function(e)
	{
		if(hold)
		{
			ctx.putImageData(0, 0);
			curX = e.clientX - canvas.offsetLeft;
			curY = e.clientY - canvas.offsetTop;
			ctx.beginPath();
			ctx.arc(Math.abs(curX + prevX) / 2, Math.abs(curY + prevY) / 2, Math.sqrt(Math.pow(curX - prevX, 2) + Math.pow(curY - prevY, 2)) / 2, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
			
			if(fillValue)
				ctx.fill();
			
			canvasData.circle.push({"starx": prevX, "stary": prevY, "radius": curX - prevX, "thick": ctx.lineWidth, "stroke": strokeValue, "strokeColor": ctx.strokeStyle, "fill": fillValue, "fillColor": ctx.fillStyle});
		}
	};

	canvas.onmouseup = function(e)
	{
		hold = false;
	};

	canvas.onmouseout = function(e)
	{
		hold = false;
	};
}

function eraser()
{

	canvas.onmousedown = function(e)
	{
		curX = e.client.X - canvas.offsetLeft;
		curY = e.clientY - canvas.offsetTop;
		hold = true;
		prevX = curX;
		prevY = curY;
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
	};

	canvas.onmousmove = function(e)
	{
		if(hold)
		{
			curX = e.clientX - canvas.offsetLeft;
			curY = e.clientY - canvas.offsetTop;
			draw();
		}
	};

	canvas.onmouseup = function(e)
	{
		hold = false;
	};

	canvas.onmouseout = function(e)
	{
		hold = false;
	};

	function draw()
	{
		ctx.lineTo(curX, curY);
		ctx.strokeStyle = "#ffffff";
		ctx.stroke();
		canvas_data.eraser.push({"startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle});
	}
}

function save()
{
	var filename = document.getElementByID("fname").value;
	var data = JSON.stringify(canvasData);
	var image = canvas.toDataURL();

	$.post("/", {save_fname : filename, save_cdata: data, save_image: image});
	alert(filename + " saved");
}





