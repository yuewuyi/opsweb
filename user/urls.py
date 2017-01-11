from django.conf.urls import url

from . import login
urlpatterns = [
    url(r'^$',login.index, name='login_index'),
    url(r'^login_post/',login.login_post,name='login_post')
]