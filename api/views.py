from django.http import HttpResponse
from utils.zabbix_public_invok import zabbix_data
import json
import time
import datetime
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
            data['host_item_ids'][item]['data']=cpu_data[data['host_item_ids'][item]['data']]
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
#获取历史数据
def zabbix_history_get(request):
    if request.method == 'POST':
        value_name='value'
        data=json.loads(request.body.decode())
        start_time=datetime.datetime.utcfromtimestamp(data["start_time"])
        end_time = datetime.datetime.utcfromtimestamp(data["stop_time"])
        history={
            "output":"extend",
            "history":int(data['value_type']),
            "itemids":data['itemids'],
            "time_from":data["start_time"],
            "time_till":data["stop_time"],
            "sortfield":"clock",
            "sortorder":"ACS",
        }

        zabbix_data_get=zabbix_data()
        if (end_time - start_time).days > 7:
            value_name = 'value_max'
            result = zabbix_data_get.item_trend_get(history)
        else:
            result=zabbix_data_get.item_history_get(history)
        if not result:
            hostid=list(data['host_item_ids'].keys())[0]
            data['host_item_ids'][hostid]['data']=[0,0]
            return HttpResponse(json.dumps(data['host_item_ids']), content_type='application/json')
        rely_data= {}
        for item in result:
            if not item['itemid'] in rely_data.keys():
                rely_data[item['itemid']] = []
            if not int(data['value_type']):
                rely_data[item['itemid']].append([int(item['clock'])*1000,  round(float(item[value_name]),2)])
            else:
                rely_data[item['itemid']].append([int(item['clock']) * 1000, int(item[value_name])])
        for item in data['host_item_ids']:
            data['host_item_ids'][item]['data']=rely_data[data['host_item_ids'][item]['data']]
        return HttpResponse(json.dumps(data['host_item_ids']),content_type='application/json')
    else:
        return HttpResponse(status=404)
