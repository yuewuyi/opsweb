from django.conf.urls import url
from . import views
from . import deploy
urlpatterns = [
    url(r'^zabbix_cpu_get/$',views.zabbix_cpu_get, name='ZabbixCpuGet'),
    url(r'^zabbix_history_get/$',views.zabbix_history_get, name='ZabbixHistoryGet'),
    url(r'^zabbix_memory_get/$',views.zabbix_memory_get,name='ZabbixMemoryGet'),
    url(r'^TomcatThriftLog/$',views.TomcatThriftLog,name='tomcatThriftLogApi'),
    url(r'^logScroll/$',views.logScroll,name='logScrollApi'),
    url(r'^nginxLog/$',views.nginxLog,name='nginxLogApi'),
    url(r'^customQuery/$',views.customQuery,name='customQueryApi'),
    url(r'^addHost/$',deploy.addHost,name='addHost'),
    url(r'^updateHost/$',deploy.updateHost,name='updateHost'),
    url(r'^delHost/$',deploy.delHost,name='delHost'),
    url(r'^bindHost/$',deploy.bindHost,name='bindHost'),
    url(r'^template/$',deploy.modTemplate,name='appTemplate'),
    url(r'^getTemplate/$',deploy.getTemplate,name='getTemplate'),
    url(r'^modApplication/$',deploy.modApplication,name='modApplicationApi'),
    url(r'^getApplication/$',deploy.getAapplication,name='getApplications'),
    url(r'^getWebTemplate/$',deploy.getWebTemplate,name='getWebTemplate'),
    url(r'^modWebApplication/$',deploy.modWebApplication,name='getWebTemplate'),
    url(r'^startStopApp/$',deploy.startStopApp,name='startStopApp'),
    url(r'^uploadFile/$',deploy.uploadFile,name='uploadFileApi'),
    url(r'^modWebTemplate/$',deploy.modWebTemplate,name='modWebTeplate'),
    url(r'^modAppFile/$',deploy.modAppFile,name='modAppFile'),
    url(r'^fileManager/$',deploy.fileManager,name='fileManagerApi'),
    url(r'^getFile/$',deploy.getFileInfo,name='getFileApi'),
    url(r'^deployBackUp/$',deploy.deployOrBackUp,name='deployAndBackupApi')
]