from django.shortcuts import render
from django.http import HttpResponse
from utils.config import app_config
from decimal import Decimal
from utils.zabbix_public_invok import zabbix_data
import json
import time
# Create your views here.
def zabbix_cpu_get(request):
    if request.method == 'POST':
        data=json.loads(request.body.decode())
        params={
            "output":"extend",
            "history":0,
            "itemids":data['itemids'],
            "hostids":data['hostids'],
            "time_from":int(time.time())-7200,
            "sortfield":"clock",
            "sortorder":"ACS",
        }
        zabbix_data_get=zabbix_data()
        result=zabbix_data_get.item_history_get(params)
        cpu_data= {}
        for item in result:
            if not item['itemid'] in cpu_data.keys():
                cpu_data[item['itemid']] = []
            cpu_data[item['itemid']].append([time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(int(item['clock']))), float(item['value'])])
        for item in data['host_item_ids']:
            data['host_item_ids'][item]['system.cpu.util[,,avg1]']=cpu_data[data['host_item_ids'][item]['system.cpu.util[,,avg1]']]
        return HttpResponse(json.dumps(data['host_item_ids']),content_type='application/json')
    else:
        return HttpResponse(status=404)
def zabbix_memory_get(request):
    if request.method=="POST":
        data=json.loads(request.body.decode())
        params={
            "output":"extend",
            "hitory":3,
            "itemids":data["itemids"],
            "hostids":data["hostids"],
            "time_from":int(time.time())-7200,
            "sortfield":"clock",
            "sortorder":"ACS",
        }
        zabbix_data_get=zabbix_data()
        result = zabbix_data_get.item_history_get(params)
        cpu_data={}
        for item in result:
            if not item['itemid'] in cpu_data.keys():
                cpu_data[item['itemid']] = []
            cpu_data[item['itemid']].append([time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(item['clock']))), round(int(item['value'])/(1024*1024*1024),2)])
        for item in data['host_item_ids']:
            memory_total=cpu_data[data['host_item_ids'][item]['vm.memory.size[total]']][len(cpu_data[data['host_item_ids'][item]['vm.memory.size[total]']][0])-1][1]
            data['host_item_ids'][item]['vm.memory.size[total]']=memory_total
            for i in range(len(cpu_data[data['host_item_ids'][item]['vm.memory.size[available]']])):
                memory_available=cpu_data[data['host_item_ids'][item]['vm.memory.size[available]']][i][1]
                cpu_data[data['host_item_ids'][item]['vm.memory.size[available]']][i][1]=round(memory_total-memory_available,2)
                cpu_data[data['host_item_ids'][item]['vm.memory.size[available]']][i].append(round((memory_total-memory_available)/memory_total*100,2))
            data['host_item_ids'][item]['vm.memory.size[available]'] = cpu_data[data['host_item_ids'][item]['vm.memory.size[available]']]
        return HttpResponse(json.dumps(data['host_item_ids']),content_type='application/json')
    else:
        return HttpResponse(status=404)