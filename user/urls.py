from django.conf.urls import url

from . import login
urlpatterns = [
    url(r'^$',login.index, name='login'),
    url(r'^Login/$',login.login_post,name='LoginPost')
]