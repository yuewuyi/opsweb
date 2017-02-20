from api.models import Config
#获取配置
class app_config():
    def get_config_value(config_key):
        return Config.objects.filter(config_key=config_key).values()[0]
    # def __update_auth_key(self):
