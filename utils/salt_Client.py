import requests
from utils.config import app_config
import json
class saltClient:
    __tokenId=""
    def __init__(self):
        conf = app_config()
        self.__config_dit = conf.get_config_value()
        self.__tokenId=self.__login()
#登录
    def __login(self):
        parm={"eauth":"pam"}
        parm["username"]=self.__config_dit["salt_api_user"][0]
        parm["password"] = self.__config_dit["salt_api_user"][1]
        reslut=self.__request("/login",parm,20)
        return reslut[0]["token"]
    def MinionStatus(self):
        parm={"fun":"manage.status"}
        parm["client"]="runner"
        return self.__request("/",parm,60)
    def OperKey(self,oper_type,match,):
        parm = {"fun": oper_type}
        parm["client"]="wheel"
        parm["match"]=match
        result=self.__request("/",parm,60)
        return result

    def __request(self,path,parm,timeout):
        headers = {'content-type': 'application/json',"X-Auth-Token":self.__tokenId}
        url=self.__config_dit["salt_api_url"][0]+":"+self.__config_dit["salt_api_url"][1]+path
        result=requests.post(url,json.dumps(parm),verify=False,timeout=timeout,headers=headers)
        if result.status_code!=200:
            print(result.text)
        try:
            return json.loads(result.text)["return"]
        except:
            print(result)
#注销
    def __del__(self):
        self.__request("/logout","",20)