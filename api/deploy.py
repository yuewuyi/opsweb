import json
from deploy.models import host,appTemplate
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
        if postData["operType"]=='accept':
            saltFun="key.accept"
        elif postData["operType"]=='delete':
            saltFun="key.delete"
        result=salt.OperKey(saltFun,postData['ip'])

        #接受key
        if result[0]["data"]["return"] and postData["operType"]=='accept':
            host.objects.filter(id=postData['id'],ip=postData['ip']).update(isSaltStack=1,status=1)
        elif not result[0]["data"]["return"] and postData["operType"]=='accept':
            code = -1
            msg = "绑定失败"


        #删除key
        if not result[0]["data"]["return"] and postData["operType"]=='delete':
            host.objects.filter(id=postData['id'],ip=postData['ip']).update(isSaltStack=0,status=0)
        elif result[0]["data"]["return"] and postData["operType"]=='delete':
            code = -1
            msg = "解绑失败"

        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')

    else:
        return HttpResponse(status=403)
def template(request):
    if request.method=='POST':
        code=0
        msg=''
        postData=json.loads(request.body.decode())
        if postData['method']=='add':
            if not appTemplate.objects.filter(appName=postData['templateName']):
                appTemplate.objects.create(appName=postData['templateName'],startCmd=postData['startCmd'],stopCmd=postData['stopCmd'])
            else:
                code=-1
                msg='模板名已存在'
        elif postData['method']=='update':
            if not appTemplate.objects.filter(~Q(id=postData['id']),appName=postData['templateName']):
                appTemplate.objects.filter(id=postData['id']).update(appName=postData['templateName'],startCmd=postData['startCmd'],stopCmd=postData['stopCmd'])
            else:
                code=-1
                msg='模板名已存在'
        elif postData['method']=='del':
            if appTemplate.objects.filter(id=postData['id'],appName=postData['templateName']):
                appTemplate.objects.filter(id=postData['id'],appName=postData['templateName']).delete()
            else:
                code=-1
                msg='删除失败'

        return HttpResponse(json.dumps({'code':code,'msg':msg}),content_type='application/json')

    else:
        return  HttpResponse(status=403)
