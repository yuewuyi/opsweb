from django.http import HttpResponse
from utils.zabbix_public_invok import zabbix_data
import json
#cpu使用值请求
def zabbix_cpu_get(request):
    if request.method == 'POST':
        data=json.loads(request.body.decode())
        all_cpu_history={
            "output":"extend",
            "history":0,
            "itemids":data['itemids'],
            "time_from":data["start_time"],
            "time_till":data["stop_time"],
            "sortfield":"clock",
            "sortorder":"ACS",
        }
        zabbix_data_get=zabbix_data()
        result=zabbix_data_get.item_history_get(all_cpu_history)
        cpu_data= {}
        for item in result:
            if not item['itemid'] in cpu_data.keys():
                cpu_data[item['itemid']] = []
            cpu_data[item['itemid']].append([int(item['clock'])*1000,  round(float(item['value']),2)])
        for item in data['host_item_ids']:
            data['host_item_ids'][item]['cpu_util']=cpu_data[data['host_item_ids'][item]['cpu_util']]
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
            "time_from":data["start_time"],
            "time_till":data["stop_time"],
            "sortfield":"clock",
            "sortorder":"ACS",
        }
        zabbix_data_get=zabbix_data()
        result = zabbix_data_get.item_history_get(params)
        cpu_data={}
        for item in result:
            if not item['itemid'] in cpu_data.keys():
                cpu_data[item['itemid']] = []
            cpu_data[item['itemid']].append([int(item['clock'])*1000, round(int(item['value'])/(1024*1024*1024),2)])
        for item in data['host_item_ids']:
            memory_total=cpu_data[data['host_item_ids'][item]['total_mem']][len(cpu_data[data['host_item_ids'][item]['total_mem']][0])-1][1]
            data['host_item_ids'][item]['total_mem']=memory_total
            for i in range(len(cpu_data[data['host_item_ids'][item]['alivable_mem']])):
                memory_available=cpu_data[data['host_item_ids'][item]['alivable_mem']][i][1]
                cpu_data[data['host_item_ids'][item]['alivable_mem']][i][1]=round(memory_total-memory_available,2)
                cpu_data[data['host_item_ids'][item]['alivable_mem']][i].append(round((memory_total-memory_available)/memory_total*100,2))
            data['host_item_ids'][item]['alivable_mem'] = cpu_data[data['host_item_ids'][item]['alivable_mem']]
        return HttpResponse(json.dumps(data['host_item_ids']),content_type='application/json')
    else:
        return HttpResponse(status=404)
def zabbix_disk_speed_get(request):
    if request.method == "POST":
        return HttpResponse('mdzz')
    else:
        return HttpResponse(status=404)
