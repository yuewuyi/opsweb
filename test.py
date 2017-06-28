#elasticsearch 调用
from elasticsearch import Elasticsearch
import json
class ElasticSearch:
    __ElscApi=''
    def __init__(self):
        self.__ElscApi=Elasticsearch("http://121.41.23.54:80/elastic/")
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
es=ElasticSearch()
print(es.LogView())