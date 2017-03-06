from django.shortcuts import render
from django.http import HttpResponse
from utils.config import app_config
from utils.zabbix_public_invok import zabbix_data
import json
# Create your views here.
def zabbix_host_get(request):
    if request.method=='POST':
        conf = app_config()
        config_value = conf.get_config_value()
    else:
        return HttpResponse(status=404)
def zabbix_cpu_memory_data(request):
    if request.method == 'POST':
        zabbix_data_get=zabbix_data()
        # hostid=json.loads(request.POST['hostid'])
        hostid=['10140','10140','10140']
        item_name=["system.cpu.util[,,avg1]","vm.memory.size[total]","vm.memory.size[available]"]
        zabbix_data_get.item_history_get()
    else:
        return HttpResponse(status=404)