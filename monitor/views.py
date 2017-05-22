from django.shortcuts import render
from utils.zabbix_public_invok import zabbix_data
from django.http import HttpResponse
from utils.config import app_config
import re
def index(request):
    conf=app_config()
    conf=conf.get_zabbix_item_key()
    params = {
        "output": ["host", "available", "error", "status"],
        "selectInterfaces": ["ip"],
        "selectTriggers": 'extend',
        "selectItems": ["itemid","name",'value_type','units'],
        "sortfield": ['host'],
        'search':{}
    }
    try:
        params['search']["host"]=request.GET['host_name']
        params['search']["ip"]=request.GET['ipaddr']
    except:
        params['search']={}
    zabbix_data_get = zabbix_data()
    result = zabbix_data_get.host_trigger_get(params)
    return  render(request, 'monitor/index.html', {"data": result,"zabbix_conf":[conf]})
def config(request):
    params = {
        "output": "extend",
        "hitory": 3,
        "hostids":[10141],
        "time_from": 1493713024,
        "time_till": 1493713624,
        "sortfield": "clock",
        "sortorder": "ACS",
    }
    zabbix_data_get = zabbix_data()
    result=zabbix_data_get.item_history_get(params)
    return HttpResponse(result)
    # return render(request, 'monitor/config.html')
def host_info_detailed(request):
    conf = app_config()
    conf = conf.get_zabbix_item_key()
    tomcat = re.compile(r'^[\w]*%s$'%conf['tomcat_ping'])
    thrift = re.compile(r'^[\w\-\.]*%s$'%conf['thrift_ping'])
    disk=re.compile(r'^%s[\w\-\/:\.]*$'%conf['disk_used_space'])
    nic=re.compile(r'^%s[\w]*$'%conf['nic_out'])
    app={
        'tomcat':[],
        'thrift':[],
        'disk':[],
        'nic':[],
    }
    item={
        "output":['itemid','name','lastvalue','value_type','units'],
        "filter":{
            "host":request.GET['host']
        },
    }
    zabbix_data_get = zabbix_data()
    result = zabbix_data_get.item_get(item)
    for item in result:
        name=item['name']
        if tomcat.search(name):
            app['tomcat'].append(name.split(conf['tomcat_ping'])[0])
        elif thrift.search(name):
            app['thrift'].append(name.split(conf['thrift_ping'])[0])
        elif disk.search(name):
            app['disk'].append(name.split(conf['disk_used_space'])[1])
        elif nic.search(name):
            app['nic'].append(name.split(conf['nic_out'])[1])
    return render(request,'monitor/host_detailed.html',{"data":{'app':app,'result':result,'conf':conf}})


