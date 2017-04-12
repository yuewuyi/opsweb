from django.shortcuts import render
from utils.zabbix_public_invok import zabbix_data
from django.http import HttpResponse
import re
# Create your views here.
def index(request):
    params = {
        "output": ["host", "available", "error", "status"],
        "selectInterfaces": ["ip"],
        "selectTriggers": 'extend',
        "selectItems":["itemid","key_"],
        "sortfield": ['host'],
        "search": {}
    }
    if request.method=="POST":
        if request.POST['host_name']:
            params['search']["host"]=request.POST['host_name']
        if request.POST['ip_addr']:
            params['search']["ip"] = request.POST['ip_addr']
    zabbix_data_get=zabbix_data()
    result=zabbix_data_get.host_trigger_get(params)
    return render(request,'monitor/index.html',{"data":result})
def config(request):
    return render(request, 'monitor/config.html')
def host_info_detailed(request):
    tomcat = re.compile(r'^app[\d]*_Tomcat_ping$')
    thrift = re.compile(r'^[\w\-\.]*_thrift_ping$')
    disk=re.compile(r'^Used_disk_space_on_[\w\-\/:\.]*$')
    nic=re.compile(r'^Outgoing_network_traffic_on_eth[0-1]$')
    app={
        'tomcat':[],
        'thrift':[],
        'disk':[],
        'nic':[],
    }
    item={
        "output":['itemid','name','lastvalue','key_'],
        "filter":{
            "host":request.GET['host']
        },
    }
    zabbix_data_get = zabbix_data()
    result = zabbix_data_get.item_get(item)
    for item in result:
        name=item['name']
        if tomcat.search(name):
            app['tomcat'].append(name.split('_Tomcat_ping')[0])
        elif thrift.search(name):
            app['thrift'].append(name.split('_thrift_ping')[0])
        elif disk.search(name):
            app['disk'].append(name.split('Used_disk_space_on_')[1])
        elif nic.search(name):
            app['nic'].append(name.split('Outgoing_network_traffic_on_')[1])
    return render(request,'monitor/host_detailed.html',{"data":{'app':app,'result':result}})


