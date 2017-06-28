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
        # self.__ElscApi = Elasticsearch("http://121.41.23.54:80/elastic/")
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
  "size": 10,
  "sort": [
    {
      "@timestamp": {
        "order": "desc",
        "unmapped_type": "boolean"
      }
    }
  ],
  "query": {
    "bool": {
      "must": [
        {
          "query_string": {
            "query": "*",
            "analyze_wildcard": True
          }
        },
        {
          "range": {
            "@timestamp": {
              "gte": 1498618414844,
              "lte": 1498632814844,
              "format": "epoch_millis"
            }
          }
        }
      ],
      "must_not": [

      ]
    }
  },
  "_source": {
    "excludes": [

    ]
  },
  "aggs": {
    "date": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "300s",
        "time_zone": "Asia/Shanghai",
        "min_doc_count": 1
      }
      ,"aggs": {
        "LogType": {
          "terms": {
            "field": "LogType"
          }
        }
      }
    }
  }
}
      return self.__ElscApi.search(index="*", body=parm)