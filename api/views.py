from django.shortcuts import render
from django.http import HttpResponse
from zabbix.api import ZabbixAPI
from utils.config import app_config
import json
# Create your views here.
def zabbix_host_get(request):
    if request.method=='POST':
        conf = app_config()
        config_value = conf.get_config_value()
        zapi = ZabbixAPI(url=config_value['zabbix_api_addr'][0], user=config_value['zabbix_api_user'][0], password=config_value['zabbix_api_user'][1])
        result= zapi.do_request('host.get',json.loads(request.body.decode()))['result']
        filter(funzz,result)
        return HttpResponse(json.dumps(result),content_type="application/json")
    else:
        return HttpResponse(status=404)
def funzz(x):
    print(x)
    return False