function save()
{
	var filename = document.getElementById("fname").value;
	var data = JSON.stringify(canvas_data);
	
	$.post("/", { save_fname: filename, save_cdata: data });
	alert(filename + " saved");
}
