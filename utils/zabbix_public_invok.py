from zabbix.api import ZabbixAPI
from utils.config import app_config
class zabbix_data:
    __conf_value=''
    def __init__(self):
        conf=app_config()
        self.__config_value=conf.get_config_value()
    def host_trigger_get(self,params):
        zapi = ZabbixAPI(url=self.__config_value['zabbix_api_addr'][0], user=self.__config_value['zabbix_api_user'][0],password=self.__config_value['zabbix_api_user'][1])
        result = zapi.do_request('host.get',params)['result']
        for i in range(len(result)):
            result[i]['triggers'] = list(filter(lambda x: x['value'] == "1" or x['status'] == 1, result[i]['triggers']))
        return result
