from django.shortcuts import render
from django.http import HttpResponse
from deploy.models import host,appTemplate
from utils.pageCalc import page
import urllib
# Create your views here.
#主机页面
def index(request):
    #判断是否有get参数
    try:
        pageId = int(request.GET['pageId'])
    except:
        pageId=1
    pageFun = page(pageId=pageId,pageSize=13)
    limitStart,limitEnd=pageFun.calcPageNum()
    queryParm = {}
    try:
        queryParm={}
        hostName=urllib.parse.unquote(request.GET['hostName'])
        ipAddr=urllib.parse.unquote(request.GET['ipAddr'])
        saltBind=int(request.GET['saltBind'])
        saltStatus=int(request.GET['saltStatus'])
        if hostName:
            queryParm['hostName__contains']=hostName
        if ipAddr:
            queryParm['ip__contains']=ipAddr
        if saltBind !=3:
            queryParm['isSaltStack'] =saltBind
        if saltStatus !=2:
            queryParm ['status']= saltStatus
    except:
        pass
    pageCount=host.objects.filter(**queryParm).count()
    Host=list(host.objects.filter(**queryParm).values()[limitStart:limitEnd])
    pageDit=pageFun.calcPage(pageCount)
    #判断是否是第一页或最后一页
    return render(request,'deploy/index.html',{"allHostInfo":Host,"pageDit":pageDit})
def tempPage(request):
    try:
        pageId=int(request.GET['pageId'])
    except:
        pageId=1
    pageFun = page(pageId=pageId, pageSize=13)
    limitStart, limitEnd = pageFun.calcPageNum()
    queryParm={}
    try:
        appName=urllib.parse.unquote(request.GET['appName'])
        startCmd=urllib.parse.unquote(request.GET['startCmd'])
        stopCmd=urllib.parse.unquote(request.GET['stopCmd'])
        if appName:
            queryParm['appName_contains']=appName
        if startCmd:
            queryParm['startCmd_contains']=startCmd
        if stopCmd:
            queryParm['stopCmd_contains']=stopCmd
    except:
        pass
    pageCount = appTemplate.objects.filter(**queryParm).count()
    tmplate=list(appTemplate.objects.filter(**queryParm).values()[limitStart:limitEnd])
    pageDit=pageFun.calcPage(pageCount)
    return render(request,'deploy/appTemple.html',{'template':tmplate,'pageDit':pageDit})
def hostApp(request):
    try:
        hostId = int(request.GET['hostId'])
        if not host.objects.filter(id=hostId).count():
            return HttpResponse(status=404)
    except:
        return HttpResponse(status=404)
    hostName=host.objects.filter(id=hostId).first().hostName

    return render(request,'deploy/hostApp.html',{'hostName':hostName})