from django.conf.urls import url

from . import login
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns = [
    url(r'^$',login.index, name='login'),
    url(r'^Login/$',login.login_post,name='LoginPost'),
    url(r'^signOut/$',login.signOut,name='signOut')
]
urlpatterns += staticfiles_urlpatterns()