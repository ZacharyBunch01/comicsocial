var canvas = document.getElementById("paint");
var image = document.getElementById("image");
var ctx = canvas.getContext("2d");
var width = canvas.width, height = canvas.height;
var curX, curY, prevX, prevY;
var mousePos = { x : 0, y : 0 };
var lastPos = mousePos;
var hold = false;
var isTouch = false;
var fillValue = true, strokeValue = false;
var canvasData = {"pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [], "text": []};
ctx.lineWidth = 2;
var font = '14px sans-serif';
var hasInput = false;

// Add a white background, otherwise background displays as transparent
var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var data = imgData.data;

for(var i = 0; i < data.length; i += 4)
{
    if(data[i + 3] < 255)
    {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
        data[i + 3] = 255 - data[i + 3];
    }
}

ctx.putImageData(imgData, 0, 0);

canvas.addEventListener("touchstart", function (e)
{
    mousePos = getTouchPos(canvas, e);
    
    curX = mousePos - canvas.getBoundingClientRect().left;
    curY = mousePos - canvas.getBoundingClientRect().top;
    
    isTouch = true;
    
    var touch = e.touches[0];
    
    var mouseEvent = new MouseEvent("mousedown", { clientX : touch.clientX, clientY : touch.clientY });
    canvas.dispatchEvent(mouseEvent);
    
}, false);

canvas.addEventListener("touchend", function (e)
{
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
    
    isTouch = false;
    
}, false);

canvas.addEventListener("touchmove", function (e)
{
    var touch = e.touches[0];
    
    var mouseEvent = new MouseEvent("mousemove", { clientX : touch.clientX, clientY : touch.clientY });
    
    canvas.dispatchEvent(mouseEvent);
    
    isTouch = true;
    
}, false);

function getTouchPos(canvasDom, touchEvent)
{
    var rect = canvasDom.getBoundingClientRect();
    
    return
    {
        x : touchEvent.touches[0].clientX - getBoundingClientRect().left,
        y.touchEvent.touches[0].clientY - getBoundingClientRect().top
    };
}

document.body.addEventListener("touchstart", function (e)
{
    if (e.target == canvas)
    {
        e.preventDefault();
    }

}, {passive : false});

document.body.addEventListener("touchend", function (e)
{
    if (e.target == canvas)
    {
        e.preventDefault();
    }
    
}, {passive : false});

document.body.addEventListener("touchmove", function (e)
{
    if (e.target == canvas)
    {
        e.preventDefault();
    }
    
}, {passive : false});

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
    // Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasData = {"pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [], "text": []};

    // Make the background white
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    for(var i = 0; i < data.length; i += 4)
    {
        if(data[i + 3] < 255){
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
            data[i + 3] = 255 - data[i + 3];
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function pencil()
{
	canvas.onmousedown = function(e)
	{
		curX = e.clientX - canvas.getBoundingClientRect().left;
		curY = e.clientY - canvas.getBoundingClientRect().top;
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
			curX = e.clientX - canvas.getBoundingClientRect().left;
			curY = e.clientY - canvas.getBoundingClientRect().top;
			draw();
		}
	};

	canvas.onmouseup = function(e)
	{
		hold = false;
	};

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
		prevX = e.clientX - canvas.getBoundingClientRect().left;
		prevY = e.clientY - canvas.getBoundingClientRect().top;
		hold = true;
	};

	canvas.onmousemove = function(e)
	{
		if(hold)
		{
			ctx.putImageData(img, 0, 0);
			curX = e.clientX - canvas.getBoundingClientRect().left;
			curY = e.clientY - canvas.getBoundingClientRect().top;
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
	};

	canvas.onmouseout = function(e)
	{
		hold = false;
	};
}

function rectangle()
{
	canvas.onmousedown = function(e)
	{
		img = ctx.getImageData(0, 0, width, height);
		prevX = e.clientX - canvas.getBoundingClientRect().left;
		prevY = e.clientY - canvas.getBoundingClientRect().top;
		hold = true;
	};

	canvas.onmousemove = function(e)
	{
		if(hold)
		{
			ctx.putImageData(img, 0, 0);
			curX = e.clientX - canvas.getBoundingClientRect().left - prevX;
			curY = e.clientY - canvas.getBoundingClientRect().top - prevY;
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
		prevX = e.clientX - canvas.getBoundingClientRect().left;
		prevY = e.clientY - canvas.getBoundingClientRect().top;
		hold = true;
	};

	canvas.onmousemove = function(e)
	{
		if(hold)
		{
			ctx.putImageData(img, 0, 0);
			curX = e.clientX - canvas.getBoundingClientRect().left;
			curY = e.clientY - canvas.getBoundingClientRect().top;
			ctx.beginPath();
			ctx.arc(Math.abs(curX + prevX) * 0.5, Math.abs(curY + prevY)  * 0.5, Math.sqrt(Math.pow(curX - prevX, 2) + Math.pow(curY - prevY, 2)) * 0.5, 0, Math.PI * 2, true);
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
		curX = e.client.X - canvas.getBoundingClientRect().left;
		curY = e.clientY - canvas.getBoundingClientRect().top;
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
			curX = e.clientX - canvas.getBoundingClientRect().left;
			curY = e.clientY - canvas.getBoundingClientRect().top;
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
	var filename = document.getElementById("fname").value;
	var data = JSON.stringify(canvasData);
	var image = canvas.toDataURL();

	$.post("/", {save_fname : filename, save_cdata: data, save_image: image});
	//alert(filename + " saved");
}

function savecomic()
{
	$('#canvas').click(function(){
     $(this).parent().attr('href', document.getElementById('canvas').toDataURL());
     $(this).parent().attr('download', "comic.png");    
});
}

function text()
{
    canvas.onmousedown = function(e)
    {
        if (hasInput) return;
            addInput(e.clientX, e.clientY);
    }
}

function addInput(x, y)
{
    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

function handleEnter(e)
{
    if(e.keyCode == 13)
    {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        hasInput = false;
    }
}

function drawText(txt, x, y)
{
    ctx.textBaseLine = 'top';
    ctx.textAlign = 'left'
    ctx.font = '14px sans-serif'
    
    ctx.fillText(txt, x - canvas.getBoundingClientRect().left, y - canvas.getBoundingClientRect().top + 15);
}

imageHolder = canvas.toDataURL();
