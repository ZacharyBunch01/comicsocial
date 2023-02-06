var canvas = document.getElementById("paint");
var image = document.getElementById("image");
var dropRegion = document.getElementById("drop-region");
var imageCanvas = document.getElementById("imageCanvas");
var imageWidth = document.getElementById("imageWidth"); // I hate that I have to do this. It's so clunky.
var imageWidthCanvas = imageWidth.innerHTML;
var imageHeight = document.getElementById("imageHeight");
var imageHeightCanvas = imageHeight.innerHTML;
var lineWidth = document.getElementById("lineWidth");
var lineWidthCanvas = lineWidth.innerHTML;
var imageRotation = document.getElementById("imageRotation");
var imageRotationCanvas = imageRotation.innerHTML;
var imageFlipped = document.getElementById("imageFlipped");
var imageSubmitted = document.getElementById("imageSubmitted"); // I hate this, I hate this, I hate this, I hate this, I hate this
var imagePreviewRegion = document.getElementById("image-preview");
var canvasHeightHTML = document.getElementById("canvasheight");
var ctx = canvas.getContext("2d");
var ctxImage = imageCanvas.getContext("2d");
var r = document.querySelector(':root');
var curX, curY, prevX, prevY;
var mousePos = { x : 0, y : 0 };
var lastPos = mousePos;
var hold = false;
var isTouch = false;
var fillValue = true, strokeValue = false;
var canvasData = {"pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [], "text": []};
var font = '14px sans-serif';
var hasInput = false;

function highlight()
{
    dropRegion.classList.add('highlighted');
}

function unhighlight()
{
    dropRegion.classList.remove("highlighted");
}

// Change canvas size according to template

var templateImage = new Image();

if(document.URL.includes("template"))
{
    if(document.URL.includes("1"))
    {
        canvas.width = 600;
        canvas.height = 600;
        ctx.canvas.width = 600;
        ctx.canvas.height = 600;
        templateImage.src = '../../../media/uploads/assets/template1.png';
        
        imageCanvas.width = 600;
        imageCanvas.height = 600;
        ctxImage.canvas.width = 600;
        ctxImage.canvas.height = 600;
        
        document.getElementById("noncanv").style.marginTop = "600px";
        
        r.style.setProperty('--canvasWidth', canvas.width);
        r.style.setProperty('--canvasHeight', canvas.height);
    }
    else if(document.URL.includes("2"))
    {
        canvas.width = 600;
        canvas.height = 600;
        ctx.canvas.width = 600;
        ctx.canvas.height = 600;
        templateImage.src = '../../../media/uploads/assets/template8.png';
        
        imageCanvas.width = 600;
        imageCanvas.height = 600;
        ctxImage.canvas.width = 600;
        ctxImage.canvas.height = 600;
        ctxImage.canvas.style = ctxImage.style + "margin-top: 150px;";
        
        document.getElementById("noncanv").style.marginTop = "600px";
        
        r.style.setProperty('--canvasWidth', canvas.width);
        r.style.setProperty('--canvasHeight', canvas.height);
    }
    else if(document.URL.includes("3"))
    {
        canvas.width = 600;
        canvas.height = 600;
        ctx.canvas.width = 600;
        ctx.canvas.height = 600;
        templateImage.src = '../../../media/uploads/assets/template9.png';
        
        imageCanvas.width = 600;
        imageCanvas.height = 600;
        ctxImage.canvas.width = 600;
        ctxImage.canvas.height = 600;
        
        document.getElementById("noncanv").style.marginTop = "600px";
        
        r.style.setProperty('--canvasWidth', canvas.width);
        r.style.setProperty('--canvasHeight', canvas.height);
    }
    else if(document.URL.includes("4"))
    {
        canvas.width = 600;
        canvas.height = 900;
        ctx.canvas.width = 600;
        ctx.canvas.height = 900;
        
        imageCanvas.width = 600;
        imageCanvas.height = 900;
        ctxImage.canvas.width = 600;
        ctxImage.canvas.height = 900;
        templateImage.src = '../../../media/uploads/assets/template2.png';
        
        document.getElementById("noncanv").style.marginTop = "900px";
        
        r.style.setProperty('--canvasWidth', canvas.width);
        r.style.setProperty('--canvasHeight', canvas.height);
    }
    else if(document.URL.includes("5"))
    {
        canvas.width = 600;
        canvas.height = 900;
        ctx.canvas.width = 600;
        ctx.canvas.height = 900;
        templateImage.src = '../../../media/uploads/assets/template6.png';
        
        imageCanvas.width = 600;
        imageCanvas.height = 900;
        ctxImage.canvas.width = 600;
        ctxImage.canvas.height = 900;
        
        document.getElementById("noncanv").style.marginTop = "900px";
        
        r.style.setProperty('--canvasWidth', canvas.width);
        r.style.setProperty('--canvasHeight', canvas.height);
    }
    else if(document.URL.includes("template/6"))
    {
        canvas.width = 900;
        canvas.height = 600;
        ctx.canvas.width = 900;
        ctx.canvas.height = 600;
        templateImage.src = '../../../media/uploads/assets/template3.png';
        
        imageCanvas.width = 900;
        imageCanvas.height = 600;
        ctxImage.canvas.width = 900;
        ctxImage.canvas.height = 600;
        
        document.getElementById("noncanv").style.marginTop = "600px";
        
        r.style.setProperty('--canvasWidth', canvas.width);
        r.style.setProperty('--canvasHeight', canvas.height);
    }
    else if(document.URL.includes("7"))
    {
        canvas.width = 900;
        canvas.height = 600;
        ctx.canvas.width = 900;
        ctx.canvas.height = 600;
        templateImage.src = '../../../media/uploads/assets/template7.png';
        
        imageCanvas.width = 900;
        imageCanvas.height = 600;
        ctxImage.canvas.width = 900;
        ctxImage.canvas.height = 600;
        
        document.getElementById("noncanv").style.marginTop = "600px";
        
        r.style.setProperty('--canvasWidth', ctx.canvas.width);
        r.style.setProperty('--canvasHeight', ctx.canvas.height);
    }
}

ctxImage.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

templateImage.onload = function()
{
    ctx.drawImage(templateImage, 0, 0);
}

var width = canvas.width, height = canvas.height;

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

// Image Uploader
var fakeInput = document.createElement("input");
fakeInput.type = "file";
fakeInput.accept = "image/*";
fakeInput.multiple = true;
dropRegion.addEventListener('click', function(e)
{
    if (e.target == canvas || e.target == imageCanvas)
    {
        e.preventDefault();
    }
    
    fakeInput.click();
}, {passive : false});

fakeInput.addEventListener("change", function()
{
    var files = fakeInput.files;
    handleFiles(files);
});

canvas.addEventListener("mousedown", function(e)
{
    if (e.target == canvas || e.target == imageCanvas)
    {
        checkLineWidth();
        e.preventDefault();
    }
    
    savehistory();
}, {passive : false});

canvas.addEventListener("keypress", readInput);

function readInput()
{
    var evtobj = canvas.event ? event : e
    
    if(evtobj.keyCode == 90 && evtobj.ctrlKey)// && e.ctrlKey)
        alert("You found the easter egg!!!");
        

    if(e.keyCode == 89)// && e.ctrlKey)
        redo();
};

function preventDefault(e)
{
    e.preventDefault();
    e.stopPropagation();
}

dropRegion.addEventListener('dragenter', preventDefault, false);
dropRegion.addEventListener('dragleave', preventDefault, false);
dropRegion.addEventListener('dragover', preventDefault, false);
dropRegion.addEventListener('drop', preventDefault, false);

canvas.addEventListener('dragenter', preventDefault, false);
canvas.addEventListener('dragleave', preventDefault, false);
canvas.addEventListener('dragover', preventDefault, false);
canvas.addEventListener('drop', preventDefault, false);

function handleFiles(files)
{
    for(var i = 0, len = files.length; i < len; i++)
    {
        if(validateImage(files[i]))
            previewAnduploadImage(files[i]);
    }
}

function handleDrop(e)
{
    if(e.target == dropRegion && e.target != imageCanvas)
    {
        console.log("handleDrop is being called.");
        
        var dt = e.dataTransfer;
        var files = dt.files;
            
        if(files.length)
        {
            handleFiles(files);
        }
        else
        {
            var html = dt.getData('text/html');
            var match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html);
            var url = match && match[1];
                
            if(url)
            {
                uploadImageFromURL(url);
                return;
            }
        }
            
        function uploadImageFromURL(url)
        {
            var img = new Image;
                
            img.onload = function()
            {
                //imageCanvas.scale = 1;
                var c = document.createElement("dropRegionCanvas");
                var ctxDropRegion = ctxImage;
                ctxDropRegion.drawImage(this, 0, 0);
                c.toBlob(function(blob)
                {
                    handleFiles( [blob] );
                }, "image/png");
            };
                
            img.onerror = function()
            {
                alert("There was an error uploading the image.");
            }
                
            img.crossOrigin = "";
            img.src = url;
        }
    }
}

dropRegion.addEventListener('drop', handleDrop, false);

var guy1URL = "../../../media/uploads/assets/Guy11.png";

function canvasHandleDrop(e)
{
    if(e.target == canvas && e.target != dropRegion)
    {
        console.log("canvasHandleDrop is being called.");
        
        var dt = e.dataTransfer;
        var files = dt.files;
        
        function uploadImageFromURL(url)
        {
            var img = new Image;
            
            img.onload = function()
            {
                imageCanvas.scale = canvas.scale;
                imageCanvas.width = canvas.width;
                imageCanvas.height = canvas.height;
                ctxImage.width = ctx.width;
                ctxImage.height = ctx.height;
                
                ctxImage.drawImage(this, 0, 0, this.width, this.height);
            };
                
            img.onerror = function()
            {
                alert("There was an error uploading the image.");
            }
                
            img.crossOrigin = "";
            img.src = url;
            
            savehistory();
        }
        
        if(files.length)
        {
            handleFiles(files);
        }
        else
        {
            var html = dt.getData('text/html');
            var match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html);
            var url = match && match[1];
                
            if(url)
            {
                uploadImageFromURL(url);
                return;
            }
        }
    }
    
    editImageCanvas();
}

function editImageCanvas()
{
    if(imageSubmitted)
    {
        ctx.drawImage(this, canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top, this.width, this.height);
    }
}

canvas.addEventListener('drop', canvasHandleDrop, false);

function validateImage(image)
{
    var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if(validTypes.indexOf(image.type) === -1)
    {
        alert("Invalid File Type");
        return false;
    }
    
    var maxSizeInBytes = 10e6;
    
    if(image.size > maxSizeInBytes)
    {
        alert("Image file is too large.");
        return false;
    }
    
    return true;
}

// Uploading the image
function previewAnduploadImage(image)
{
    var imgView = document.createElement("div");
    imgView.className = "image-view";
    imagePreviewRegion.appendChild(imgView);
    
    var img = document.createElement("img");
    imgView.appendChild(img);
    
    var overlay = document.createElement("div");
    overlay.className = "overlay";
    imgView.appendChild(overlay);

    var reader = new FileReader();

    reader.onload = function(e)
    {
        img.src = e.target.result;
    }
    
    reader.readAsDataURL(image);

    var formData = new FormData();
    formData.append('comic', image);

    var uploadLocation = ''; // URL of upload handler.

    var ajax = new XMLHttpRequest();
    ajax.open("POST", uploadLocation, true);

    ajax.onreadystatechange = function(e)
    {
        if(ajax.readyState === 4)
        {
            if(ajax.status === 200)
            {
                
            }
            else
            {
                
            }
        }
    }

    ajax.upload.onprogress = function(e)
    {
        var perc = (e.loaded / e.total * 100) || 100, width = 100 - perc;
        
        overlay.style.width = width;
    }

    ajax.send(formData);
}

function detectDragDrop()
{
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
}

var dragSupported = detectDragDrop();

if(!dragSupported)
{
    document.getElementByClassName("drop-message")[0].innerHTML = 'Click to upload';
}

// Drag images from image set onto canvas.

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
        x.touchEvent.touches[0].clientX - getBoundingClientRect().left,
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
    if (e.target == canvas || e.target == dropRegion)
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

function checkLineWidth()
{
    lineWidthCanvas = (lineWidth.innerHTML / 4);
    ctx.lineWidth = lineWidthCanvas;
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
    savehistory();
    
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
    
    ctx.drawImage(templateImage, 0, 0);
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
		canvasData.pencil.push({"startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": lineWidth, "color": ctx.strokeStyle});
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
			canvasData.line.push({"starx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": lineWidth, "color": ctx.strokeStyle});
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

			canvasData.rectangle.push({"starx": prevX, "stary": prevY, "width": curX, "height": curY, "thick": lineWidth, "stroke": strokeValue, "strokeColor": ctx.strokeStyle, "fill": fillValue, "fillColor": ctx.fillStyle});
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
			
			canvasData.circle.push({"starx": prevX, "stary": prevY, "radius": curX - prevX, "thick": lineWidth, "stroke": strokeValue, "strokeColor": ctx.strokeStyle, "fill": fillValue, "fillColor": ctx.fillStyle});
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
		canvas_data.eraser.push({"startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": lineWidth, "color": ctx.strokeStyle});
	}
}

function save()
{
    //var link = document.getElementById('link');
    //link.setAttribute('download', 'comic.png');
    //link.setAttribute('href', canvas.toDataURL("comic/png").replace("comic/png", "image/octet-stream"));
    //link.click();
    
    image = canvas.toDataURL("image/png");
    fname = document.getElement("fname");
}

var savedImages = [];
var removedImages = [];
var amountOfImages = 0;
var amountOfRedoImages = 0;

function savehistory()
{
    var imgSrc = canvas.toDataURL("image/png");
    savedImages.push(imgSrc);
    amountOfImages++;
}

function removehistory()
{
    var imgSrc = canvas.toDataURL("image/png");
    removedImages.push(imgSrc);
    amountOfImages--;
}

var canUndo = false;

function undo()
{
    //if the stack is empty then disable the undo button
    if(amountOfImages > 0)
    {
        removehistory();
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //canvasData = {"pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [], "text": []};
        
        var canvasImageHistory = new Image();
        //canvasImageHistory.src = savedImages.pop();
        canvasImageHistory.onload = function()
        {
            ctx.drawImage(canvasImageHistory, 0, 0);
        }
        
        canvasImageHistory.src = savedImages.pop();
        
        amountOfRedoImages++;
    }
}

function redo()
{
    if(amountOfRedoImages > 0)
    {
        savehistory();
        
        var redoImage = new Image();
        
        redoImage.onload = function()
        {
            ctx.drawImage(redoImage, 0, 0);
        };
    
        redoImage.src = removedImages.pop();
        
        amountOfRedoImages--;
    }
}

function savecomic()
{
    var tmpLink = document.createElement('a');
    tmpLink.download = 'comic.png';
    var imageData = canvas.toDataURL("image/png");
    tmpLink.href = imageData;

    document.body.appendChild(tmpLink);
    tmpLink.click()
    document.body.removeChild(tmpLink);
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
    savehistory();
    ctx.textBaseLine = 'top';
    ctx.textAlign = 'left'
    ctx.font = '14px sans-serif'
    
    ctx.fillText(txt, x - canvas.getBoundingClientRect().left, y - canvas.getBoundingClientRect().top + 15);
}

imageHolder = canvas.toDataURL();

function flipV()
{
    ctxImage.scale(1, -1);
}

function flipH()
{
    ctxImage.scale(-1, 1);
}

function scaleImage()
{
    imageCanvas.width = imageWidth;
    imageCanvas.height = imageHeight;
    ctxImage.width = imageWidth;
    ctxImage.height = imageHeight;
}

function rotateImage()
{
    ctxImage.rotate(imageRotation * Math.PI / 180);
}

function submitImage()
{
    imageSubmitted = true;
}

// HTML sucks imho
function textEnterPress(e)
{
    if (event.keyCode == 13)
    {
        save();
    }
}
