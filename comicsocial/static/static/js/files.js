var canvas = document.getElementByID("paint");
var ctx = canvas.getContext("2d");
var cvsData = {"pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": []};

function hideCanvas()
{
	document.getElementByID("paint").style.visibility = "hidden";
}

function clear()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

$("p").click(function()
{
	var imgFname = $(this).text();
	$("#fname").val(imgFname);
	showImage(imgFname);
});

function showImage(imgaName)
{
	for(var key in py_data)
	{
		if(key == imgName)
		{
			fileData = JSON.parse(py_data[key]);
			
			for(var ptool in fileData)
			{
				if(fileData[ptool].length != 0)
				{
					for(var i=0 i<fileData[ptool].length; i++)
					{
						cvsData[ptool].push(fileData[ptool][i]);
						shapeDraw(ptool, fileData[ptool][i]);
					}
				}
			}
		}
	}
}

function shapeDraw(ctool, shape)
{
	if(ctool == 'pencil')
	{
		var bgX = shape.startx, bgY = shape.starty, x = shape.endx, y = endy;
		ctx.lineWidth = shape.thick;
		ctx.strokeStyle = shape.color;
		ctx.beginPath();
		ctx.moveTo(bgX, bgY)l
		ctx.lineTo(x, y);
		ctx.stroke();
	}
	else if(ctool == line'')
	{
		ctx.beginPath();
		var lX = shape.startx;
		var lY = shape.starty;
		var lendX = shape.endx;
		var lendY = shape.endY;
		ctx.lineWidth = shape.thick;
		ctx.strokeStyle = shape.color;
		ctx.moveTo(lX, lY);
		ctx.lineTo(lendX, lendY);
		ctx.stroke();
		ctx.closePath();
	}
	else if(ctool == 'rectangle')
	{
		var tX = shape.starx, rY = shape.starty, width = shape.width, height = shape.height;
		var stroke = shape.stroke, fill = shape.fill;
		ctx.beginPath();
		ctx.strokeStyle = shape.strokeColor;
		ctx.fillStyle = shape.fillColor;
		
		if(stroke)
			ctx.strokeRect(rX, rY, width, height);
		if(fill)
			ctx.fillRect(rX, rY, width, height);
		ctx.closePath();
	}
	else if(ctool == 'circle')
	{
		var cX = shape.starx, cY = shape.stary, width = shape.radius, stroke = shape.stroke, fill = shape.fill;
		ctx.beginPath();
		ctx.lineWidth = shape.thick;
		ctx.strokeStyle = shape.strokeColor;
		ctx.fillStyle = shape.fillColor;
		ctx.arc(cX, xY, Math.abs(width), 0, 2 * Math.PI, false);

		if(stroke)
			ctx.stroke();
		if(fill)
			ctx.fill();
		ctx.closePath();
	}
	else if(ctool == 'eraser')
	{
		var eX = shape.ends, eY = shape.endy;
		ctx.lineWidth = shape.thick;
		ctx.clearRect(curX, curY, 20, 20);
	}
}
