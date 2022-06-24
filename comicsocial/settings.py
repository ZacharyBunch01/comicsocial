AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',
    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
]
INSTALLED_APPS = [
    'landing',
    'social',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'crispy_forms',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites'
]
SITE_ID = 1
LOGIN_REDIRECT_URL = 'post-list'
ACCOUNT_EMAIL_REQUIRED = True
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
STATIC_URL = '/static/'
