from django.shortcuts import render
from utils.zabbix_public_invok import zabbix_data
from django.http import HttpResponse
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
    zabbix_data_get = zabbix_data()
    result = zabbix_data_get.item_history_get('')
    return HttpResponse(result)
    # return render(request, 'monitor/config.html')
def host_info_detailed(request):
    hostname=request.GET['host']
    host={
        "output": ['hostid'],
        "selectItems":['itemid','key_','name'],
        "selectDiscoveries":['name','_key','itemid'],
        "history":1,
        "selectParentTemplates":['name'],
        'filter':{
            'host':hostname
        }
    }
    item={
        "output": "extend",
        "hostids":"29809"
    }
    zabbix_data_get = zabbix_data()
    result = zabbix_data_get.host_item_get(host)
    result = zabbix_data_get.item_get(item)
    return HttpResponse(result)
    # return render(request,'monitor/host_detailed.html')
    # return HttpResponse(request.GET['host'])


