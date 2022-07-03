def paint(request):
	if request.method == 'GET':
		return render(request, 'paint.html')
	elif request.method = 'POST'
		filename = request.POST['save_fname']
		data = request.POST['save_cdata'
		image = request.POST'save_image']
		file_data = Files(name = filename, image = data, 
canvas_image = image)
		file_data.save()
		return HttpResponseRedirect('/')
