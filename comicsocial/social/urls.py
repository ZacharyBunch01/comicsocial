from django.urls import path
from .views import PostListView, PostDetailView, PostEditView, PostDeleteView, CommentDeleteView, ProfileView, ProfileEditView, AddFollower, RemoveFollower, AddLike, AddDislike, UserSearch, ListFollowers, AddCommentLike, AddCommentDislike, CommentReplyView	

urlpatterns = [
	path('', PostListView.as_view(), name='post-list'),
	path('post/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
	path('post/edit/<int:pk>/', PostEditView.as_view(), 
name='post-edit'),
	path('post/delete/<int:pk>', PostDeleteView.as_view(), 
name='post-delete'),
	path('post/<int:post_pk>/comment/delete/<int:pk>/', 
CommentDeleteView.as_view(), name = 'comment-delete'),
	path('post/<int:pk>/like', AddLike.as_view(), name = 'like'),
	path('post/<int:pk>/dislike', AddDislike.as_view(), name = 
'dislike'),
	path('profile/<int:pk>/', ProfileView.as_view(), name = 
'profile'),
	path('profile/edit/<int:pk>/', ProfileEditView.as_view(), name = 
'profile-edit'),
	path('profile/<int:pk>/subscribers/add', AddFollower.as_view(), 
name = 'add-subscriber'),
	path('profile/<int:pk>/subscribers/remove', 
RemoveFollower.as_view(), name = 'remove-subscriber'),
	path('search/', UserSearch.as_view(), name = 'profile-search'),
	path('profile/<int:pk>/followers', ListFollowers.as_view(), name 
= 'followers-list'),
	path('post/<int:post_pk>/comment/delete/<int:pk>/', 
CommentDeleteView.as_view(), name = 'comment-delete'),
	path('post/<int:post_pk>/comment/<int:pk>/like', 
AddCommentLike.as_view(), name = 'comment-like'),
	path('post/<int:post_pk>/comment/reply/<int:pk>', 
CommentReplyView.as_view(), name = 'comment-reply'),
]
