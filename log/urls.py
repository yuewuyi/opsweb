from django.conf.urls import url
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns = [
    url(r'^TomcatThrift/$',views.TomcatThriftLog,name="TomcatThriftLog"),
    url(r'^nginx/$',views.nginxLog,name="nginxLogPage")
]
urlpatterns += staticfiles_urlpatterns()