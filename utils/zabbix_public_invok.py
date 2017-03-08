from zabbix.api import ZabbixAPI
from utils.config import app_config
import time
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
        result=self.__zapi.do_request("history.get",params)["result"]

        return result