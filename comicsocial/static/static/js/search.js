function view(data)
{
	var canvas = document.getElementByID("paint");
	var ctx = canvas.getContext("2D");
	var newImg = document.createElement("img");
	newImg.src = data;
	document.body.appendChild(newImg);
}
