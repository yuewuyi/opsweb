from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='deployIndex'),
    url(r'^appTemplate/$',views.tempPage,name='deployAppTemplate'),
    url(r'^hostApp/$',views.hostApp,name='deployHostApp')
]
