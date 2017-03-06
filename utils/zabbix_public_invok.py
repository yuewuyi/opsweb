from zabbix.api import ZabbixAPI
from utils.config import app_config
class zabbix_data:
    __zapi=''
    def __init__(self):
        conf=app_config()
        config_value=conf.get_config_value()
        self.__zapi = ZabbixAPI(url=config_value['zabbix_api_addr'][0], user=config_value['zabbix_api_user'][0],password=config_value['zabbix_api_user'][1])
    def host_trigger_get(self,params):
        warn=[]
        disable=[]
        enable=[]
        result = self.__zapi.do_request('host.get',params)['result']
        for i in range(len(result)):
            result[i]['triggers'] = list(filter(lambda x: x['value'] == "1" and x['status'] == "0", result[i]['triggers']))
            if result[i]['status']=='1':
                disable.append(result[i])
            elif result[i]['triggers']:
                warn.append(result[i])
            else:
                enable.append(result[i])
        return warn+enable+disable
    def item_history_get(self,params):
        params={
            "output":["itemid","hostid","key_"],
            "filter":{
                "key_":["system.cpu.util[,,avg1]","vm.memory.size[total]","vm.memory.size[available]"]
            },
        }
        result1=self.__zapi.do_request('item.get',params)['result']
        items=[]
        hostid=[]
        print(result1)
        for i in range(len(result1)):
            items.append(result1[i]['itemid'])
            hostid.append(result1[i]['hostid'])
        params={
            "output": "extend",
            "itemids":items,
            "hostids":hostid,
            "sortfield": "clock",
            "time_from":1488782241-3600,
            "sortfield":"clock"
        }
        result=self.__zapi.do_request("history.get",params)['result']
        return result