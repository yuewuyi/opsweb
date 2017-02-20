from urllib import request,parse
from http import client
from utils.config import app_config
class Http_request:
    __zabbix_json={
        "jsonrpc":"2.0",
        "method":"user.login",
        "params":{  'user':'admin',
                     'password':'f#t@2016zabbix'
                    },
        "id":1,
        "auth":'null'
    }
    def request_post(self,data,url):
        header={'Content-Type':'application/json'}
        data=parse.urlencode(data).encode(encoding='UTF8')
        con=client.HTTPConnection('http://zabbix.cdfortis.com/api_jsonrpc.php',80,timeout=30)
        con.request("POST","",data,header)
        # req=request.Request(url,headers=header,data=data)
        # page=request.urlopen(req).read()
        # return page

    def zabbix_request_post(self,data,method):
        return self.request_post(self.__zabbix_json,app_config.get_config_value('zabbix_api_addr')['config_item'])






