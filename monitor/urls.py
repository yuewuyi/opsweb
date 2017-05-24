from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$',views.index, name='MonitorIndex'),
    url(r'^host_detailed/$',views.host_info_detailed,name="MonitorHostDetailed"),
    url(r'^config/$',views.config,name='MonitorConfig'),
    url(r'^last_data/$',views.last_data,name='LastData')
]