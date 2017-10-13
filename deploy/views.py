from django.shortcuts import render
from deploy.models import host
import math
from . import tasks
from utils.salt_Client import saltClient
# Create your views here.
#主机页面
def index(request):
    #判断是否有get参数
    pageSize=13
    try:
        pageId = int(request.GET['pageId'])
    except:
        pageId=1
    limitStart = (pageId-1) * pageSize
    limitEnd=limitStart+pageSize
    pageDit = {"lt": True, "nt": True, "pageList": [],"pageId":pageId}
    try:
        queryParm={}
        hostName=request.GET['hostName']
        ipAddr=request.GET['ipAddr']
        saltBind=int(request.GET['saltBind'])
        saltStatus=int(request.GET['saltStatus'])
        if hostName:
            queryParm={'hostName__contains':hostName}
        if ipAddr:
            queryParm={'ip__contains':ipAddr}
        if saltBind !=3:
            queryParm = {'isSaltStack': saltBind}
        if saltStatus !=2:
            queryParm = {'status': saltStatus}
        pageCount=host.objects.filter(**queryParm).count()
        Host=list(host.objects.filter(**queryParm).values()[limitStart:limitEnd])
    except Exception as e:
        pageCount =host.objects.all().count()
        Host=list(host.objects.all().values()[limitStart:limitEnd])
    pageNumber=math.ceil(float(pageCount)/float(pageSize))
    pageDit['pageList']=[i for i in range(1,pageNumber+1)]
    #判断是否是第一页或最后一页
    if len(pageDit['pageList'])!=0:
        if pageId==pageDit['pageList'][0]:
            pageDit['lt']=False
        if pageId==pageDit['pageList'][-1]:
            pageDit['nt']=False
    return render(request,'deploy/index.html',{"allHostInfo":Host,"pageDit":pageDit})