from django.http import HttpResponse
from utils.zabbix_public_invok import zabbix_data
from utils.ElsInvok import ElasticSearch
import json
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
            return HttpResponse(json.dumps(data['host_item_ids']), content_type='application/json')
        rely_data= {}
        for item in result:
            if not item['itemid'] in rely_data.keys():
                rely_data[item['itemid']] = []
            if int(data['value_type'])==0:
                rely_data[item['itemid']].append([int(item['clock'])*1000,  round(float(item[value_name]),2)])
            elif int(data['value_type'])==3:
                rely_data[item['itemid']].append([int(item['clock']) * 1000, int(item[value_name])])
            else:
                rely_data[item['itemid']].append([int(item['clock']) * 1000,item[value_name]])
        for item in data['host_item_ids']:
            try:
                data['host_item_ids'][item]['data']=rely_data[data['host_item_ids'][item]['data']]
            except Exception as e:
                pass
        return HttpResponse(json.dumps(data['host_item_ids']),content_type='application/json')
    else:
        return HttpResponse(status=404)
def TomcatThriftLog(request):
    if request.method=='POST':
        es=ElasticSearch()
        result=es.LogView()
        LogData=result['hits']
        LogCount={'date':[],'info':[],'error':[],'warn':[],'MaxCount':0}
        LogCount['TotalCount']=result['hits']['total']
        for item in result['aggregations']['date']['buckets']:
            CountDict = {}
            TypeList=['info','error','warn']
            LogCount['date'].append(item['key'])
            for item2 in item['LogType']['buckets']:
                CountDict[item2['key']]=item2['doc_count']
            for key in TypeList:
                if key in CountDict.keys():
                    if  LogCount['MaxCount']<CountDict[key]:
                        LogCount['MaxCount']=CountDict[key]
                    LogCount[key].append(CountDict[key])
                else:
                    LogCount[key].append(0)
    else:
        return HttpResponse(status=404)
    return HttpResponse(json.dumps(LogCount),content_type='application/json')