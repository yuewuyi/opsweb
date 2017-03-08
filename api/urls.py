from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^zabbix_cpu_get/$',views.zabbix_cpu_get, name='ZabbixCpuGet'),
]