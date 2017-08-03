from django.conf.urls import url
from . import main
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns = [
    url(r'^$',main.index, name='HoomeIndex'),
]
urlpatterns += staticfiles_urlpatterns()