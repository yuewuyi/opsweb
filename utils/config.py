from api.models import Config
import json
import time
from urllib import request
#获取配置
class app_config():
    def get_config_value(self,config_key):
        conf_dit={}
        conf=Config.objects.filter().values()[0]
        for item in conf:
            conf_dit[item['config_key']]
