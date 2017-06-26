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
    def LogView(self):
        a = {
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
              "gte": 1498187255327,
              "lte": 1498201655327,
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

        return self.__ElscApi.search(index="*", body=json.dumps(a))