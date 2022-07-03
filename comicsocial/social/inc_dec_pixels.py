function add_pixel()
{
	ctx.lineWidth += 1;
}

function reduce_pixel ()
{
	if(ctx.lineWidth == 2)
		reurn;
	else
		ctx.lineWidth -= 1;
}
