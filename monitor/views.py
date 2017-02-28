from django.shortcuts import render
from utils.zabbix_public_invok import zabbix_data
# Create your views here.
def index(request):
    params = {
        "output": ["host", "available", "error", "status"],
        "selectInterfaces": ["ip"],
        "selectTriggers": 'extend',
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