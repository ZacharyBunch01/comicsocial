from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver

class Post(models.Model):
	comic = models.ImageField(upload_to = 'uploads/comics/', blank = True, null = True)
	body = models.TextField()
	created_on = models.DateTimeField(default=timezone.now)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	likes = models.ManyToManyField(User, blank = True, related_name = 'likes')
	favorites = models.ManyToManyField(User, blank = True, related_name = 'postFavorites')
	dislikes = models.ManyToManyField(User, blank = True, related_name = 'dislikes')
	shared_on = models.DateTimeField(default=timezone.now)
	shared_user = models.ForeignKey(User, on_delete=models.CASCADE, null = True, blank = True, related_name = '+')
	shared_body = models.TextField(blank = True, null = True)

class Comment(models.Model):
	comment = models.TextField()
	created_on = models.DateTimeField(default=timezone.now)
	post = models.ForeignKey('Post', on_delete=models.CASCADE)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	likes = models.ManyToManyField(User, blank = True, related_name = 'comment_likes')
	dislikes = models.ManyToManyField(User, blank = True, related_name = 'comment_dislikes')
	parent = models.ForeignKey('self', on_delete = models.CASCADE, 
blank = True, null = True, related_name = '+')
	
	@property
	def children(self):
		return Comment.objects.filter(parent=self).order_by('-created_on').all()
    	
	@property
	def is_parent(self):
		if self.parent is None:
			return True
		return False

class UserProfile(models.Model):
	user = models.OneToOneField(User, primary_key=True, verbose_name = 'user', related_name = 'profile', on_delete = models.CASCADE)
	name = models.CharField(max_length = 30, blank = True, null = True)
	bio = models.TextField(max_length = 500, blank = True)
	picture = models.ImageField(upload_to = 
'uploads/profile_pictures/', default = 'uploads/profile_pictures/default.png', blank = True)
	followers = models.ManyToManyField(User, blank = True, related_name = 'followers')
	following = models.ManyToManyField(User, blank = True, related_name = 'following')
	favorites = models.ManyToManyField(Post, blank = True, related_name = 'profileFavorites')

@receiver(post_save, sender = User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user = instance)

@receiver(post_save, sender = User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Files(models.Model):
	name = models.CharField(max_length = 30)
	image = models.TextField()
	canvas_image = models.TextField()

	def __unicode__(self):
		return self.name
