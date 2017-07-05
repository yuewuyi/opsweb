#elasticsearch 调用
from utils.config import app_config
from elasticsearch import Elasticsearch
import json
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

    def TomcatThriftLogReq(self):
      self.update_filedata('TomcatThrift')
      parm = {
            "sort": [
                        {
                            "@timestamp": {
                                "order": "desc",
                                "unmapped_type": "date"
                            }
                        }
                    ],
            "query": {
                "bool": {
                    "must": [
                        {
                            "range": {
                                "@timestamp": {
                                        "gte": 1499206761292,
                                        "lte": 1499249961292,
                                        "format": "epoch_millis"
                                                }
                                     }
                         }
                            ]
                        }
                    },
            "aggs": {
                "date": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "10m",
                        "time_zone": "Asia/Shanghai",
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "LogType": {
                            "terms": {
                                "field": "LogType"
                        }
                    }
                    }
                }
            }
    }
      return self.__ElscApi.search(index="filebeat-thrift-*,filebeat-tomcat_service-*", body=parm,scroll="60m",size=20)
