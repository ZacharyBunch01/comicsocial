from django.urls import path
from .views import PostListView, PostDetailView, PostEditView, PostDeleteView, CommentDeleteView, ProfileView, ProfileEditView, AddFollower, RemoveFollower, AddLike, AddDislike, UserSearch, ListFollowers, AddCommentLike, AddCommentDislike, CommentReplyView
from .views import paint, files, TemplateView

urlpatterns = [
	path('', PostListView.as_view(), name='post-list'),
	path('post/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
	path('post/edit/<int:pk>/', PostEditView.as_view(), name='post-edit'),
	path('post/delete/<int:pk>', PostDeleteView.as_view(), name='post-delete'),
	path('post/<int:post_pk>/comment/delete/<int:pk>/', CommentDeleteView.as_view(), name = 'comment-delete'),
	path('post/<int:pk>/like', AddLike.as_view(), name = 'like'),
	path('post/<int:pk>/dislike', AddDislike.as_view(), name = 'dislike'),
	path('profile/<int:pk>/', ProfileView.as_view(), name = 'profile'),
	path('profile/edit/<int:pk>/', ProfileEditView.as_view(), name = 'profile-edit'),
	path('profile/<int:pk>/subscribers/add', AddFollower.as_view(), name = 'add-subscriber'),
	path('profile/<int:pk>/subscribers/remove', RemoveFollower.as_view(), name = 'remove-subscriber'),
	path('search/', UserSearch.as_view(), name = 'profile-search'),
	path('profile/<int:pk>/subscribers', ListFollowers.as_view(), name = 'followers-list'),
	path('post/<int:post_pk>/comment/delete/<int:pk>/', CommentDeleteView.as_view(), name = 'comment-delete'),
	path('post/<int:post_pk>/comment/<int:pk>/like', AddCommentLike.as_view(), name = 'comment-like'),
	path('post/<int:post_pk>/comment/<int:pk>/dislike', AddCommentDislike.as_view(), name = 'comment-dislike'),
	path('post/<int:post_pk>/comment/<int:pk>/reply', CommentReplyView.as_view(), name = 'comment-reply'),
    path('templates/', TemplateView.as_view(), name='templates'),
	path('draw/template/1', paint, name='drawtemplate1'),
    path('draw/template/2', paint, name='drawtemplate2'),
    path('draw/template/3', paint, name='drawtemplate3'),
    path('draw/template/4', paint, name='drawtemplate4'),
    path('draw/template/5', paint, name='drawtemplate5'),
    path('draw/template/6', paint, name='drawtemplate6'),
    path('draw/template/7', paint, name='drawtemplate7'),
	path('files/', files, name='files'),
]
