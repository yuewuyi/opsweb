from django.shortcuts import render
from utils.ElsInvok import ElasticSearch
import json
#日志视图
# Create your views here.
#tomcat,thnrift服务日志视图
def TomcatThriftLog(request):
    return render(request,'log/TomcatThriftLog.html')
def nginxLog(request):
    return render(request,'log/nginxLog.html')
def luceneQuery(request):
    indexList = []
    es = ElasticSearch()
    result = es.indexQuery('*')
    for key in result:
        indexList.append(key)
    return render(request,'log/luceneQuery.html',{'indexList':json.dumps(indexList)})