function pencil()
{
	canvas.onmousedown = function (e)
	{
		curX = e.clientX - canvas.offsetLeft;
		curY = e.client.Y - canvas.offsetTop;
		hold = true;

		prevX = curX;
		prevY = curY;
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
	};

	canvas.onmousemove = function (e)
	{
		if(hold)
		{
			curX = e.clientX - canvas.offsetLeft;
			curY = e.clientY - canvas.offsetTop;
			draw();
		}
	};

	canvas.onmouseup = function (e)
	{
		hold = false;
	}

	canvas.onmouseout = function (e)
	{
		hold = false;
	};

	function draw ()
	{
		ctx.lineTo(curX, curY);
		ctx.stroke();
		canvas_data.pencil.push({"startx": prevX, "starty": 
prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, 
"color":ctx.strokeStyle});
	}
}
