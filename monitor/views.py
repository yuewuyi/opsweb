from django.shortcuts import render
from utils.zabbix_public_invok import zabbix_data
from django.http import HttpResponse
from utils.config import app_config
from utils.abNormalCheck import abnormalCheck
import re
import time
from utils.customMultiprocessingPool import cpPoll
#监控一览视图
def index(request):
    conf=app_config()
    conf=conf.get_zabbix_item_key()
    params = {
        "output": ["host", "available", "error", "status"],
        "selectInterfaces": ["ip"],
        "selectApplications":['applicationid'],
        "selectTriggers": 'extend',
        "selectItems": ["itemid","name",'value_type','units'],
        "sortfield": ['host'],
        'search':{}
    }
    try:
        params['search']["host"]=request.GET['host_name']
        params['search']["ip"]=request.GET['ipaddr']
    except:
        params['search']={}
    zabbix_data_get = zabbix_data()
    result = zabbix_data_get.host_trigger_get(params)
    return  render(request, 'monitor/index.html', {"data": result,"zabbix_conf":[conf]})
def config(request):
    params = {
        "output": "extend",
        "hitory": 3,
        "hostids":[10141],
        "time_from": 1493713024,
        "time_till": 1493713624,
        "sortfield": "clock",
        "sortorder": "ACS",
    }
    zabbix_data_get = zabbix_data()
    result=zabbix_data_get.item_history_get(params)
    return HttpResponse(result)
#监控详情视图
def host_info_detailed(request):
    conf = app_config()
    conf = conf.get_zabbix_item_key()
    tomcat = re.compile(r'^[\w]*%s$'%conf['tomcat_ping'])
    thrift = re.compile(r'^[\w\-\.]*%s$'%conf['thrift_ping'])
    disk=re.compile(r'^%s[\w\-\/:\.]*$'%conf['disk_used_space'])
    nic=re.compile(r'^%s[\w]*$'%conf['nic_out'])
    app={
        'tomcat':[],
        'thrift':[],
        'disk':[],
        'nic':[],
    }
    item={
        "output":['itemid','name','lastvalue','value_type','units'],
        "filter":{
            "host":request.GET['host']
        },
    }
    zabbix_data_get = zabbix_data()
    result = zabbix_data_get.item_get(item)
    for item in result:
        name=item['name']
        if tomcat.search(name):
            app['tomcat'].append(name.split(conf['tomcat_ping'])[0])
        elif thrift.search(name):
            app['thrift'].append(name.split(conf['thrift_ping'])[0])
        elif disk.search(name):
            app['disk'].append(name.split(conf['disk_used_space'])[1])
        elif nic.search(name):
            app['nic'].append(name.split(conf['nic_out'])[1])
    return render(request,'monitor/host_detailed.html',{"data":{'app':app,'result':result,'conf':conf}})
#最新数据视图
def Latest_Data(request):
    Render_Data={
    }
    item_parm={
        "output":['name','itemid','lastvalue','lastclock','prevvalue','units','value_type'],
        "selectHosts":["host","hostid","status"],
        "selectApplications":["name"],
        "search":{
        },
        "filter":{
        }
    }
    try:
        if request.GET['HostName']:
            item_parm['filter']["host"]=request.GET['HostName']
        item_parm['search']["name"]=request.GET['ItemName']
    except:
        return render(request, 'monitor/Latest_Data.html', {'data': Render_Data})
    print(item_parm)
    zabbix_data_get = zabbix_data()
    result=zabbix_data_get.item_get(item_parm)
    for item in result:
        if item['hosts'][0]['status'] == '3':
            continue;
        if item['applications']:
            Application_Name=item['applications'][0]['name']
        else:
            Application_Name=''
        del (item['applications'])
        host=item['hosts'][0]
        del (item['hosts'])
        item['lastclock']=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(int(item['lastclock'])))
        if not host['host'] in Render_Data.keys():
            Render_Data[host['host']]={
                'hostid':host['hostid'],
                'application': {
                }
            }
        if not Application_Name:
            Render_Data[host['host']]['application']['other']=[]
        if not Application_Name in Render_Data[host['host']]['application'].keys() and Application_Name!='':
            Render_Data[host['host']]['application'][Application_Name]=[]
        if Application_Name:
            Render_Data[host['host']]['application'][Application_Name].append(item)
        else:
            Render_Data[host['host']]['application']['other'].append(item)
    return render(request, 'monitor/Latest_Data.html',{'data':Render_Data})
#监控字段历史页面
def history(request):
    return  render(request,'monitor/history.html')
#异常监控数据
def abnormal(request):
    # ac=abnormalCheck()
    # ac.valueCheck()
    a=cpPoll(process=4)
    return  render(request,'monitor/abnormal.html')
