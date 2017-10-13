import json
from deploy.models import host
from django.db.models import Q
from utils.salt_Client import saltClient
from django.http import HttpResponse
def addHost(request):
    if request.method=='POST':
        postData = json.loads(request.body.decode())
        code = 0
        msg = ''
        if not host.objects.filter(Q(hostName=postData['hostName'])|Q(ip=postData['ip'])):
            host.objects.create(**postData)
        else:
            code=-1
            msg="主机名或IP已存在"
        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')
    else:
        return  HttpResponse(status=404)
def updateHost(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        code=0
        msg=''
        if not host.objects.filter(~Q(id=postData['id']),Q(hostName=postData['hostName'])|Q(ip=postData['ip'])):
            host.objects.filter(id=postData['id']).update(hostName=postData['hostName'],ip=postData['ip'])
        else:
            code=-1
            msg="主机名或IP已存在"
        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')
    else:
        return  HttpResponse(status=404)
def delHost(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        code = 0
        msg = ''
        if host.objects.filter(id=postData['id'],hostName=postData['hostName']):
            host.objects.filter(id=postData['id'], hostName=postData['hostName']).delete()
        else:
            code = -1
            msg = "主机不存在"
        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')
    else:
        return HttpResponse(status=403)
def bindHost(request):
    if request.method=='POST':
        postData=json.loads(request.body.decode())
        code=0
        msg=''
        salt=saltClient()
        result=salt.OperKey('key.accept',postData['ip'])
        if result[0]["data"]["return"]:
            host.objects.filter(id=postData['id'],ip=postData['ip']).update(isSaltStack=1)
        else:
            code = -1
            msg = "绑定失败"
        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')

    else:
        return HttpResponse(status=403)
