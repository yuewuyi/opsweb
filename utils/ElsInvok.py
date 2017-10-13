#elasticsearch 调用
from utils.config import app_config
from elasticsearch import Elasticsearch
class ElasticSearch:
    __ElscApi=''
    def __init__(self):
        conf=app_config()
        conf_value=conf.get_config_value()
        self.__ElscApi=Elasticsearch([{'host': conf_value['ElastciSearchAddr'][0],'port':int(conf_value['ElastciSearchAddr'][1]),'timeout':30}])

    def logReq(self,parm,index,size,scrollTime):
        return self.__ElscApi.search(index=index, body=parm,scroll=scrollTime,size=size)
    def scrollReq(self,scrollId):
        return self.__ElscApi.scroll(scroll_id=scrollId,scroll="2m")
    def indexQuery(self,index):
        return self.__ElscApi.indices.get(index=index)