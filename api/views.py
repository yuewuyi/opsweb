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



#tomcat日志获取
def TomcatThriftLog(request):
    index="filebeat-thrift-*,filebeat-tomcat_service-*"
    parm = {
        "sort": [
            {
                "@timestamp": {
                    "order": "desc",
                    "unmapped_type": "date"
                }
            }
        ],
    }
    query={
                "bool": {
                    "must": [

                        {
                            "range": {
                                "@timestamp": {
                                        "gte": 0,
                                        "lte": 0,
                                        "format": "epoch_millis"
                                                }
                                     }
                         }
                            ]
                        }
                }
    aggs= {
                "date": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "10m",
                        "time_zone": "Asia/Shanghai",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "LogType": {
                            "terms": {
                                "field": "LogType.keyword"
                        }
                    }
                    }
                }
            }
    if request.method=='POST':
        postData = json.loads(request.body.decode())
        query['bool']['must'][0]['range']['@timestamp']['gte']=postData['startTime']
        query['bool']['must'][0]['range']['@timestamp']['lte'] = postData['endTime']
        aggs['date']['date_histogram']['interval']=str(postData['interval'])+'s'
        if postData['appName']:
            query['bool']['must'].append(
                {
                    "wildcard":{
                        "AppName":"*%s*"%(postData['appName'])
                    }
                }
            )
        if postData['ipAddr']:
            query['bool']['must'].append(
                {
                    "wildcard":{
                        "ip":"*%s*"%(postData['ipAddr'])
                    }
                }
            )
        if postData['hostName']:
            query['bool']['must'].append(
                {
                    "wildcard":{
                        "host":"*%s*"%(postData['hostName'])
                    }
                }
            )
        if postData['logType']!='all':
            query['bool']['must'].append(
                {
                    "term":{
                        "LogType":postData['logType']
                    }
                }
            )
        if postData['appType']=="thrift":
            index = "filebeat-thrift-*"
        elif postData['appType']=="tomcat":
            index = "filebeat-tomcat_service-*"
        parm['query']=query
        parm['aggs']=aggs
        es=ElasticSearch()
        result=es.logReq(parm,index,20)
        LogData=result['hits']
        LogCount={'date':[],'INFO':[],'ERROR':[],'WARN':[],'MaxCount':0}
        LogCount['TotalCount']=LogData['total']
        LogCount['LogMessage']=LogData['hits']
        LogCount['ScrollId']=result['_scroll_id']
        for item in result['aggregations']['date']['buckets']:
            CountDict = {}
            TypeList=['INFO','ERROR','WARN']
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
#根据scrollID获取日志
def logScroll(request):
    if request.method == 'POST':
        code=0
        message=''
        postData = json.loads(request.body.decode())
        try:
            es = ElasticSearch()
            result = es.scrollReq(postData['scrollId'])
            message = result['hits']['hits']
        except:
            code=-1
        return HttpResponse(json.dumps({"message":message,"code":code}), content_type='application/json')
    else:
        return HttpResponse(404)
#获取nginx日志
def nginxLog(request):
    parm = {
        "sort": [
            {
                "@timestamp": {
                    "order": "desc",
                    "unmapped_type": "date"
                }
            }
        ],
    }
    query = {
        "bool": {
            "must": [
                {
                    "range": {
                        "@timestamp": {
                            "gte": 1500780440052,
                            "lte": 1500885240052,
                            "format": "epoch_millis"
                        }
                    }
                }
            ]
        }
    }
    aggs = {
    "date": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "10h",
                        "time_zone": "Asia/Shanghai",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "status": {
                            "terms": {
                                "field": "status"
                        }
                    }
                    }
                },
    "map": {
      "geohash_grid": {
        "field": "geoip.location",
        "precision": 12
      }
    },
    "cityIp":{
      "terms": {
        "field": "geoip.city_name.keyword"
      }
      , "aggs": {
        "remote_addr": {
            "terms": {
              "field": "remote_addr.keyword"
            }
        }
      }
    }
}
    if request.method=='POST':
        postData = json.loads(request.body.decode())
        query['bool']['must'][0]['range']['@timestamp']['gte'] = postData['startTime']
        query['bool']['must'][0]['range']['@timestamp']['lte'] = postData['endTime']
        if postData['ipAddr']:
            query['bool']['must'].append(
                {
                    "wildcard":{
                        "ip":"*%s*"%(postData['ipAddr'])
                    }
                }
            )
        if postData['hostName']:
            query['bool']['must'].append(
                {
                    "wildcard":{
                        "host":"*%s*"%(postData['hostName'])
                    }
                }
            )
        if postData['agentIp']:
            query['bool']['must'].append(
                {
                    "wildcard":{
                        "remote_addr":"*%s*"%(postData['agentIp'])
                    }
                }
            )
        if postData['uri']:
            query['bool']['must'].append(
                {
                    "wildcard":{
                        "uri":"*%s*"%(postData['uri'])
                    }
                }
            )
        if postData['reqStatus']:
            if postData['reqStatusSymbol']=='=':
                query['bool']['must'].append(
                    {
                        "term": {
                            "status": postData['reqStatus']
                        }
                    }
                )
            elif postData['reqStatusSymbol']=='>=':
                query['bool']['must'].append(
                    {
                        "range": {
                            "status": {
                                'gte': postData['reqStatus']
                            }
                        }
                    }
                )
            elif postData['reqStatusSymbol']=='<=':
                query['bool']['must'].append(
                    {
                        "range": {
                            "status": {
                                'lte': postData['reqStatus']
                            }
                        }
                    }
                )
        if postData['reqTime']:
            if postData['reqTimeSymbol']=='=':
                query['bool']['must'].append(
                    {
                        "term": {
                            "request_time": postData['reqTime']
                        }
                    }
                )
            elif postData['reqTimeSymbol']=='>=':
                query['bool']['must'].append(
                    {
                        "range": {
                            "request_time":{
                                'gte': postData['reqTime']
                            }
                        }
                    }
                )
            elif postData['reqTimeSymbol']=='<=':
                query['bool']['must'].append(
                    {
                        "range": {
                            "request_time": {
                                'lte': postData['reqTime']
                            }
                        }
                    }
                )
        es = ElasticSearch()
        parm['query'] = query
        parm['aggs'] = aggs
        print(json.dumps(parm))
        result = es.logReq(parm, 'filebeat-nginx_access-*',20)
        return HttpResponse(json.dumps(result),content_type='application/json')
    else:
        return HttpResponse(404)