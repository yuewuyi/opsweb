from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^zabbix_host_get/$',views.zabbix_host_get, name='ZabbixHostGet'),
]