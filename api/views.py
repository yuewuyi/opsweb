from django.shortcuts import render
from django.http import HttpResponse
from zabbix.api import ZabbixAPI
# Create your views here.
def zabbix_host_get(request):

    # if request.method=='POST':
    parm={
            "output":"extend"
        }
    zapi = ZabbixAPI(url='', user='admin', password='f#t@2016zabbix')
    result1 = zapi.do_request('host.get',parm)
    return  HttpResponse(result1['result'])
    # else:
    #     return HttpResponse(status=404)