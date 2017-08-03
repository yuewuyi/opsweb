from django.conf.urls import url
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns = [
    url(r'^$',views.index, name='MonitorIndex'),
    url(r'^host_detailed/$',views.host_info_detailed,name="MonitorHostDetailed"),
    url(r'^config/$',views.config,name='MonitorConfig'),
    url(r'^Latest_Data/$',views.Latest_Data,name='LatestData'),
    url(r'history/$',views.history,name='MonitorHistory')
]
urlpatterns += staticfiles_urlpatterns()