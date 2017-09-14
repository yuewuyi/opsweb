from django.shortcuts import render
from deploy.models import host
# Create your views here.
#主机页面
def index(request):
    #判断是否有get参数
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
            queryParm = {'isStack': saltBind}
        if saltStatus !=2:
            queryParm = {'status': saltStatus}
        Host=list(host.objects.filter(**queryParm).values())
    except Exception as e:
        Host=list(host.objects.all().values())
    return render(request,'deploy/index.html',{"allHostInfo":Host})