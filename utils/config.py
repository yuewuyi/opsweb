from api.models import Config
from api.models import Item_Config
#获取配置
class app_config():
#获取系统配置
    @staticmethod
    def get_config_value():
        conf_dit={}
        conf=Config.objects.filter().values()
        for item in conf:
            conf_dit[item['config_key']]=[item['config_item1'],item['config_item2']]
        return conf_dit
#获取zabbix item的对应名
    @staticmethod
    def get_zabbix_item_key():
        conf_dit={}
        conf=Item_Config.objects.filter().values()
        for item in conf:
            conf_dit[item['key']] = item['item']
        return conf_dit


