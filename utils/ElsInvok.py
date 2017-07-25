#elasticsearch 调用
from utils.config import app_config
from elasticsearch import Elasticsearch
class ElasticSearch:
    __ElscApi=''
    def __init__(self):
        conf=app_config()
        conf_value=conf.get_config_value()
        self.__ElscApi=Elasticsearch([{'host': conf_value['ElastciSearchAddr'][0],'port':int(conf_value['ElastciSearchAddr'][1]),'timeout':30}])

    def logReq(self,parm,index,size):
      return self.__ElscApi.search(index=index, body=parm,scroll="1m",size=size)
    def scrollReq(self,scrollId):
        return self.__ElscApi.scroll(scroll_id=scrollId,scroll="1m")
