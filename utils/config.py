from api.models import Config
#获取配置
class config():
    def __init__(self):
        print('zz')
    def get_config_value(self,config_key):
        return Config.objects.filter(config_key=config_key)