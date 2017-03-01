from zabbix.api import ZabbixAPI
from utils.config import app_config
class zabbix_data:
    __conf_value=''
    def __init__(self):
        conf=app_config()
        self.__config_value=conf.get_config_value()
    def host_trigger_get(self,params):
        warn=[]
        disable=[]
        enable=[]
        zapi = ZabbixAPI(url=self.__config_value['zabbix_api_addr'][0], user=self.__config_value['zabbix_api_user'][0],password=self.__config_value['zabbix_api_user'][1])
        result = zapi.do_request('host.get',params)['result']
        for i in range(len(result)):
            result[i]['triggers'] = list(filter(lambda x: x['value'] == "1" and x['status'] == "0", result[i]['triggers']))
            if result[i]['status']=='1':
                disable.append(result[i])
            elif result[i]['triggers']:
                warn.append(result[i])
            else:
                enable.append(result[i])
        return warn+enable+disable