#elasticsearch 调用
from utils.config import app_config
from elasticsearch import Elasticsearch
class ElasticSearch:
    __ElscApi=''
    def __init__(self):
        conf=app_config()
        conf_value=conf.get_config_value()
        self.__ElscApi=Elasticsearch([{'host': conf_value['ElastciSearchAddr'][0],'port':int(conf_value['ElastciSearchAddr'][1])}])
    def update_filedata(self,AppType):
      parm={
          "properties": {
                "LogType": {
                    "type":     "text",
                    "fielddata": True
                            },
                "ip": {
                      "type":     "text",
                      "fielddata": True
                      }
                      }
          }
      tomcat_service={
                          'tomcat_service':parm
                    }
      thrift={
                          'thrift':parm
                    }
      if AppType=='TomcatThrift':
        self.__ElscApi.indices.put_mapping(index='filebeat-tomcat_service-*',body=tomcat_service,doc_type='tomcat_service')
        self.__ElscApi.indices.put_mapping(index='filebeat-thrift-*', body=thrift,doc_type='thrift')

    def logReq(self,parm,index):
      return self.__ElscApi.search(index=index, body=parm,scroll="60m",size=15)
