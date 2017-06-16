from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
#日志视图
# Create your views here.
#tomcat,thnrift服务日志视图
def TomcatThriftLog(request):
    return render(request,'log/TomcatThriftLog.html')