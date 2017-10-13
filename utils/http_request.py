from urllib import request
from utils.config import app_config
import json
class Http_request:
    __zabbix_json={"jsonrpc": "2.0",
                   "method":"",
                   "params":{},
                   "id": 1,
                   "auth":'null'
                   }
    def request_post(self,data,url):
        header={'Content-Type':'application/json'}
        req=request.Request(url,headers=header,data=json.dumps(data).encode('utf-8'),method='POST')
        return  request.urlopen(req).read()
    def zabbix_request_post(self,data,method):
        conf=app_config()
        self.__zabbix_json['params'] = data
        self.__zabbix_json['method']=method
        return self.request_post(self.__zabbix_json,conf.get_config_value('zabbix_api_addr')['config_item1'])











