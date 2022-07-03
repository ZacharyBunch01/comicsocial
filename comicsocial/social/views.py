from django.shortcuts import render, redirect
from django.db.models import Q
from django.views import View
from .models import Post, Comment, UserProfile
from .forms import PostForm, CommentForm
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic.edit import UpdateView, DeleteView
from django.http import HttpResponseRedirect

class PostListView(View):
	def get(self, request, *args, **kwargs):
		posts = Post.objects.all().order_by('-created_on')
		form = PostForm(request.POST, request.FILES)

		context = {
			'post_list': posts,
			'form': form,
		}
		return render(request, 'post_list.html', context)
		
	def post(self, request, *args, **kargs):
		posts = Post.objects.all()
		form = PostForm(request.POST)
		
		if form.is_valid():
			new_post = form.save(commit=False)
			new_post.author = request.user
			new_post.save()

		context = {
			'post_list': posts,
			'form': form,
		}
		return render(request, 'post_list.html', context)

class PostDetailView(LoginRequiredMixin, View):
    def get(self, request, pk, *args, **kwargs):
        post = Post.objects.get(pk = pk)
        form = CommentForm()
        comments = Comment.objects.filter(post = post).order_by('-created_on')
        context = {
            'post': post,
            'form': form,
            'comments': comments,
        }
        return render(request, 'post_detail.html', context)
    def post(self, request, pk, *args, **kwargs):
        post = Post.objects.get(pk = pk)
        form = CommentForm(request.POST)
        if form.is_valid():
            new_comment = form.save(commit=False)
            new_comment.author = request.user
            new_comment.post = post
            new_comment.save()
        
        comments = Comment.objects.filter(post=post).order_by('-created_on')
        context = {
            'post': post,
            'form': form,
            'comments': comments,
        }
        return render(request, 'post_detail.html', context)

class PostEditView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
	model = Post
	fields = ['body']
	template_name = 'post_edit.html'

	def get_success_url(self):
		pk = self.kwargs['pk']
		return reverse_lazy('post-detail', kwargs={'pk':pk})
	
	def test_func(self):
		post = self.get_object()
		return self.request.user == post.author

class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
	model = Post
	template_name = 'post_delete.html'
	success_url = reverse_lazy('post-list')

class CommentDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
	model = Comment
	template_name = 'comment_delete.html'
	
	def get_success_url(self):
		pk = self,kwargs['post_pk']
		return reverse_lazy('post-detail', kwargs={'pk' : pk})

	def get_func(self):
		comment = self,get_object()
		return self.request_user == comment.author
	
class ProfileView(View):
	def get(self, request, pk, *args, **kwargs):
		profile = UserProfile.objects.get(pk = pk)
		user = profile.user
		posts = Post.objects.filter(author = user).order_by('-created_on')

		subscribers = profile.followers.all()

		for follower in subscribers:
			if follower == request.user:
				is_following = True
				break
			else:
				is_following = False

		number_of_subscribers = len(subscribers)

		context = {
			'user': user,
			'profile': profile,
			'posts': posts,
			}
			
		return render(request, 'profile.html', context)

class ProfileEditView(LoginRequiredMixin, UserPassesTestMixin, 
UpdateView):
	model = UserProfile
	fields = ['name', 'bio', 'picture']
	template_name = 'profile_edit.html'

	def get_success_url(self):
		pk = self.kwargs['pk']
		return reverse_lazy('profile', kwargs = {'pk' : pk})

	def test_func(self):
		profile = self.get_object()
		return self.request.user == profile.user

class AddFollower(LoginRequiredMixin, View):
	def post(self, request, pk, *args, **kwargs):
		profile = UserProfile.objects.get(pk = pk)
		profile.followers.add(request.user)
		return redirect('profile', pk = profile.pk)

class RemoveFollower(LoginRequiredMixin, View):
	def post(self, request, pk, *args, **kwargs):
		profile = UserProfile.objects.get(pk = pk)
		profile.followers.remove(request.user)
		return redirect('profile', pk = profile.pk)

class AddLike(LoginRequiredMixin, View):
	def post(self, request, pk, *args, **kargs):
		post = Post.objects.get(pk = pk)

		is_dislike = False

		for dislike in post.dislikes.all():
			if dislike == request.user:
				is_dislike = True
				break
		
			if is_dislike:
				post.dislikes.remove(request.user)

			is_like = False

			for like in post.likes.all():
				if like == request.user:
					is_like = True
					break

			if not is_like:
				post.likes.add(request.user)

			if is_like:
				post.likes.remove(request.user)
			next = request.POST.get('next', '/')
			return httpResponseRedirect(next)

class AddDislike(LoginRequiredMixin, View):
	def post(self, request, pk, *args, **kwargs):
		post = Post.objects.get(pk = pk)
		is_like = False

		for like in post.likes.all():
			if like == request.user:
				is_like = True
				break

		is_dislike = False
		
		for dislike in post.dislikes.all():
			if dislike == request.user:
				is_dislike = True
				break

		if not is_dislike:
			post.dislikes.add(request.user)

		if is_dislike:
			post.dislikes.remove(request.user)
		
		next = request.POST.get('next', '/')
		return HttpResponseRedirect(next)

class UserSearch(View):
	def get(self, request, *args, **kwargs):
		query = self.request.GET.get('query')
		profile_list = UserProfile.objects.filter(Q(user__username__icontains = query))
		context = { 'profile_list': profile_list }
		return render(request, 'search.html', context)

		logged_in_user = request.user
		posts = Post.objects.filter(author__profile__followers__in=[logged_in_user.id]).order_by('-created_on')

class ListFollowers(View):
	def get(self, request, pk, *args, **kwargs):
		profile = UserProfile.objects.get(pk = pk)
		followers = profile.followers.all()

		context = {
			'profile': profile,
			'followers': followers,
		}

		return render(request, 'followers_list.html',
context)

class AddComment(LoginRequiredMixin, View):
	def post(self, request, post_pk, pk, *args, **kwargs):
		is_dislike = False

		for dislike in comment,dislikes.all():
			if dislike == request.user:
				is_dislike = True
				break

		if is_dislike:
			comment.dislikes.remove(request.user)
		
		is_like = False

		for like in comment.likes.all():
			if like == request.user:
				break

		if not is_like:
			comment.likes.add(request.user)

		if is_like:
			comment.likes.remove(request.user)

		next = request.POST.get('next', '/')
		return HttpResponseRedirect(next)

class AddCommentLike(LoginRequiredMixin, View):
	def post(self, request, post_pk, pk, *args, **kwargs):
		comment = Comment.objects.get(pk = pk)
		
		is_dislike = False

		for dislike in comment.dislikes.all():
			if dislike == request.user:
				is_dislike = True
				break

		if is_dislike:
			comment,dislikes.remove(request.user)

		is_like = False

		for like in comment.likes.all():
			if like == request.user:
				is_like = True
				break

		if not is_like:
			comment.likes.add(request.user)

		if is_like:
			comment.likes.remove(request.user)

		next = request.POST.get('next', '/')
		return HttpResponsRedirect(next)

class AddCommentDislike(LoginRequiredMixin, View):
	def post(self, request, post_pk, pk, *args, **kwargs):
		comment = Comment.objects.get(pk = pk)

		is_like = false

		for like in comment.likes.all():
			if like == request.user:
				is_like = True
				break

		if is_like:
			comment.likes.remove(request.user)

		is_dislike = False

		for dislike in comment.dislikes.all():
			if dislike == request.user:
				is_dislike = True
				break

		if not is_dislike:
			comment,dislikes.add(request.user)
			
		if is_dislike:
			comment.dislikes.remove(request.user)

		next = request.POST.get('next', '/')
		return HttpResponseRedirect(next)

class CommentReplyView(LoginRequiredMixin, View):
	def post(self, request, post_pk, pk, *args, **kwargs):
		post = Post.objects.get(pk = post_pk)
		parent_comment = Comment.objects.get(pk = pk)
		form = CommentForm(request.POST)

		if form.is_valid():
			new_comment = form.save(commit = False)
			new_comment.author = request.user
			new_comment.post = post
			new_comment.parent = parent_comment
			new_comment.save()

		comments = Comment.object.filter(post = post).order_by('-created_on')

		context = {
			'post': post,
			'form': form,
			'comments': comments,
			}

		return redirect('post-detail', pk = post_pk)

